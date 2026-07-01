'use client'

import { useEffect, useState } from 'react'
import {
  LEADERBOARD_METRICS,
  LEADERBOARD_PERIODS,
  METRIC_META,
  PERIOD_META,
  medalFor,
  displayName,
  formatUsd,
  formatSignedUsd,
  formatPct,
  type LeaderboardMetric,
  type LeaderboardPeriod,
  type LeaderboardEntry,
} from '@/lib/leaderboard'

function initial(name: string) {
  return (name || 'A')[0].toUpperCase()
}

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<LeaderboardMetric>('volume')
  const [period, setPeriod] = useState<LeaderboardPeriod>('all')
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ metric, period, limit: '50' })
        const res = await fetch(`/api/leaderboard?${params}`, { signal: controller.signal })
        const json = await res.json()
        setRows(json.data || [])
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setRows([])
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => controller.abort()
  }, [metric, period])

  const primary = (e: LeaderboardEntry) => {
    if (metric === 'winrate') return formatPct(e.win_rate)
    if (metric === 'pnl') return formatSignedUsd(e.profit_loss_usd)
    return formatUsd(e.total_volume_usd)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">🏆 Leaderboard</h1>
      <p className="text-base-content/60 text-sm mb-6">
        Top predictors — {PERIOD_META[period]} by {METRIC_META[metric].label.toLowerCase()}
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div role="tablist" aria-label="Metric" className="tabs tabs-boxed w-fit">
          {LEADERBOARD_METRICS.map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={metric === m}
              className={`tab ${metric === m ? 'tab-active' : ''}`}
              onClick={() => setMetric(m)}
            >
              {METRIC_META[m].label}
            </button>
          ))}
        </div>
        <div role="tablist" aria-label="Period" className="tabs tabs-boxed w-fit">
          {LEADERBOARD_PERIODS.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              className={`tab ${period === p ? 'tab-active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'all' ? 'All' : p === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-lg" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-base-content/50">
          <div className="text-5xl mb-4">🏅</div>
          <p className="font-medium">No ranked traders yet</p>
          <p className="text-sm mt-1">Place some bets to appear on the board.</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {rows.length >= 3 && (
            <div className="flex justify-center items-end gap-4 mb-10">
              {[1, 0, 2].map((idx) => {
                const p = rows[idx]
                const heights = ['h-16', 'h-24', 'h-12']
                const colors = ['bg-base-300', 'bg-yellow-400 text-white', 'bg-orange-300 text-white']
                return (
                  <div key={p.id} className="flex flex-col items-center">
                    <div className="avatar placeholder mb-2">
                      <div className={`${idx === 0 ? 'bg-yellow-400 text-white w-16' : idx === 1 ? 'bg-base-300 w-14' : 'bg-orange-300 text-white w-12'} rounded-full`}>
                        <span className="text-xl">{medalFor(idx + 1)}</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold truncate max-w-[90px] text-center">
                      {displayName(p)}
                    </p>
                    <p className="text-xs text-base-content/60">{primary(p)}</p>
                    <div className={`${colors[idx]} ${heights[idx]} w-20 rounded-t-xl flex items-center justify-center text-2xl mt-2 font-bold`}>
                      {idx + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full table */}
          <div className="table-wrapper overflow-x-auto rounded-xl border border-base-300">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th>Trader</th>
                  <th className="text-right">{METRIC_META[metric].short}</th>
                  <th className="text-right">Bets</th>
                  <th className="text-right">Win %</th>
                  <th className="text-right">P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  const rank = p.rank ?? i + 1
                  return (
                    <tr key={p.id} className="hover">
                      <td className="font-bold text-base-content/60">{medalFor(rank) || rank}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">{initial(displayName(p))}</span>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{displayName(p)}</p>
                            {p.username && <p className="text-xs text-base-content/50">@{p.username}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-mono text-sm font-semibold">{primary(p)}</td>
                      <td className="text-right text-sm">{p.total_bets || 0}</td>
                      <td className="text-right text-sm">
                        <span
                          className={`badge badge-sm ${
                            (p.win_rate || 0) >= 0.5 ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {formatPct(p.win_rate)}
                        </span>
                      </td>
                      <td
                        className={`text-right font-mono text-sm font-semibold ${
                          (p.profit_loss_usd || 0) >= 0 ? 'text-success' : 'text-error'
                        }`}
                      >
                        {formatSignedUsd(p.profit_loss_usd)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
