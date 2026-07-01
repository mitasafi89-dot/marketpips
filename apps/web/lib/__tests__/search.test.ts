import { describe, it, expect } from 'vitest'
import {
  sanitizeQuery,
  clampInt,
  normalizeSort,
  normalizeStatus,
  normalizeCategory,
  parseSearchParams,
  buildPagination,
  splitHighlight,
  relevanceScore,
  rankByRelevance,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  MAX_QUERY_LEN,
} from '@/lib/search'

describe('sanitizeQuery', () => {
  it('trims, collapses whitespace, strips control chars', () => {
    expect(sanitizeQuery('  hello   world  ')).toBe('hello world')
    expect(sanitizeQuery('a\u0000b\tc')).toBe('a b c')
    expect(sanitizeQuery(null)).toBe('')
    expect(sanitizeQuery(undefined)).toBe('')
  })
  it('caps length', () => {
    expect(sanitizeQuery('x'.repeat(500)).length).toBe(MAX_QUERY_LEN)
  })
})

describe('clampInt', () => {
  it('clamps and falls back', () => {
    expect(clampInt('5', 1, 10, 1)).toBe(5)
    expect(clampInt('99', 1, 10, 1)).toBe(10)
    expect(clampInt('-3', 1, 10, 1)).toBe(1)
    expect(clampInt('abc', 1, 10, 7)).toBe(7)
    expect(clampInt(null, 1, 10, 2)).toBe(2)
  })
})

describe('normalizers', () => {
  it('normalizeSort', () => {
    expect(normalizeSort('volume')).toBe('volume')
    expect(normalizeSort('bogus')).toBe('relevance')
    expect(normalizeSort(null)).toBe('relevance')
  })
  it('normalizeStatus', () => {
    expect(normalizeStatus('closed')).toBe('closed')
    expect(normalizeStatus('all')).toBe('all')
    expect(normalizeStatus('weird')).toBe('active')
  })
  it('normalizeCategory', () => {
    expect(normalizeCategory('crypto')).toBe('crypto')
    expect(normalizeCategory('all')).toBeNull()
    expect(normalizeCategory('notacat')).toBeNull()
    expect(normalizeCategory(null)).toBeNull()
  })
})

describe('parseSearchParams', () => {
  it('defaults: no query -> volume sort, page 1', () => {
    const p = parseSearchParams(new URLSearchParams(''))
    expect(p.q).toBe('')
    expect(p.sort).toBe('volume')
    expect(p.page).toBe(1)
    expect(p.perPage).toBe(DEFAULT_PER_PAGE)
    expect(p.offset).toBe(0)
  })
  it('a query with no sort defaults to relevance', () => {
    const p = parseSearchParams(new URLSearchParams('q=election'))
    expect(p.q).toBe('election')
    expect(p.sort).toBe('relevance')
  })
  it('clamps per_page and computes offset', () => {
    const p = parseSearchParams(new URLSearchParams('per_page=999&page=3'))
    expect(p.perPage).toBe(MAX_PER_PAGE)
    expect(p.offset).toBe((3 - 1) * MAX_PER_PAGE)
  })
  it('rejects invalid category/status/sort', () => {
    const p = parseSearchParams(new URLSearchParams('category=xx&status=yy&sort=zz'))
    expect(p.category).toBeNull()
    expect(p.status).toBe('active')
    expect(p.sort).toBe('relevance')
  })
})

describe('buildPagination', () => {
  it('computes total pages and flags', () => {
    expect(buildPagination(45, 1, 20)).toEqual({
      total: 45,
      page: 1,
      per_page: 20,
      total_pages: 3,
      has_next: true,
      has_prev: false,
    })
    const last = buildPagination(45, 3, 20)
    expect(last.has_next).toBe(false)
    expect(last.has_prev).toBe(true)
  })
  it('handles zero results', () => {
    expect(buildPagination(0, 1, 20).total_pages).toBe(0)
  })
})

describe('splitHighlight', () => {
  it('flags matching spans case-insensitively', () => {
    const segs = splitHighlight('Kenya Election 2027', 'election')
    expect(segs.some((s) => s.match && /election/i.test(s.text))).toBe(true)
    expect(segs.map((s) => s.text).join('')).toBe('Kenya Election 2027')
  })
  it('no query -> single non-match segment', () => {
    expect(splitHighlight('hello', '')).toEqual([{ text: 'hello', match: false }])
  })
})

describe('relevance ranking (search relevance gate)', () => {
  const titleMatch = { title: 'Kenya presidential election 2027', description: 'who wins', tags: ['politics'] }
  const descMatch = { title: 'Nairobi rainfall record', description: 'general election commentary', tags: ['weather'] }
  const tagMatch = { title: 'City vote outlook', description: 'urban forecast', tags: ['election'] }

  it('a title match outranks a description-only match', () => {
    expect(relevanceScore(titleMatch, 'election')).toBeGreaterThan(relevanceScore(descMatch, 'election'))
  })
  it('a tag match outranks a description-only match', () => {
    expect(relevanceScore(tagMatch, 'election')).toBeGreaterThan(relevanceScore(descMatch, 'election'))
  })
  it('rankByRelevance orders title > tag > description', () => {
    const ranked = rankByRelevance([descMatch, tagMatch, titleMatch], 'election')
    expect(ranked[0]).toBe(titleMatch)
    expect(ranked[2]).toBe(descMatch)
  })
  it('volume only breaks ties, never overturns a weight tier', () => {
    const hiVolDesc = { ...descMatch, total_volume_usd: 5_000_000 }
    expect(relevanceScore(titleMatch, 'election')).toBeGreaterThan(relevanceScore(hiVolDesc, 'election'))
  })
  it('empty query yields zero score', () => {
    expect(relevanceScore(titleMatch, '')).toBe(0)
  })
})
