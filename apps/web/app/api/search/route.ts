import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseSearchParams, buildPagination } from '@/lib/search'

// Search reflects live market data; never statically cache.
export const dynamic = 'force-dynamic'

/**
 * GET /api/search
 * Relevance-ranked full-text market search backed by the `search_markets`
 * RPC (weighted tsvector + trigram fuzzy fallback, filters, pagination).
 *
 * Query params: q, category, status (active|closed|resolved|all),
 * sort (relevance|volume|newest|closing|bettors), page, per_page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const p = parseSearchParams(searchParams)

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_markets', {
    p_query: p.q,
    p_category: p.category,
    p_status: p.status,
    p_sort: p.sort,
    p_limit: p.limit,
    p_offset: p.offset,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const payload = (data ?? {}) as {
    data?: unknown[]
    total?: number
  }
  const rows = Array.isArray(payload.data) ? payload.data : []
  const total = typeof payload.total === 'number' ? payload.total : 0
  const pagination = buildPagination(total, p.page, p.perPage)

  return NextResponse.json(
    {
      data: rows,
      ...pagination,
      sort: p.sort,
      query: p.q,
    },
    {
      headers: {
        // Short private cache; results are user-agnostic but volatile.
        'Cache-Control': 'no-store',
      },
    }
  )
}
