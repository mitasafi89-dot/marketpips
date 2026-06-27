'use client'

import Link from 'next/link'
import { IconArrowRight, IconShield, IconTrendUp, IconGlobe } from '@/components/ui/icons'

const STATS = [
  { label: 'Active Markets', value: '124', icon: '📊' },
  { label: 'Total Volume', value: '$2.4M', icon: '💰' },
  { label: 'Countries', value: '7', icon: '🌍' },
  { label: 'Traders', value: '8,200+', icon: '👥' },
]

const COUNTRIES = [
  { flag: '🇰🇪', name: 'Kenya', currency: 'KES' },
  { flag: '🇺🇬', name: 'Uganda', currency: 'UGX' },
  { flag: '🇹🇿', name: 'Tanzania', currency: 'TZS' },
  { flag: '🇷🇼', name: 'Rwanda', currency: 'RWF' },
  { flag: '🇿🇲', name: 'Zambia', currency: 'ZMW' },
  { flag: '🇪🇹', name: 'Ethiopia', currency: 'ETB' },
  { flag: '🇧🇮', name: 'Burundi', currency: 'BIF' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #16a34a 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-3xl">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
            style={{ background: 'var(--green-faint)', borderColor: 'rgba(34,197,94,0.25)', color: 'var(--green)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-light animate-pulse-dot inline-block" />
            <span className="text-xs font-semibold">Live prediction markets · East Africa</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight mb-5"
            style={{ color: 'var(--text-primary)' }}>
            Predict the future.<br />
            <span style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Get paid.</span>
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Trade on real-world outcomes — elections, sports, economics, crypto. Pay with M-Pesa, MTN MoMo, or Airtel Money. Built for East Africa.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/markets" className="btn btn-primary btn-lg">
              Browse Markets <IconArrowRight size={16} />
            </Link>
            <Link href="/auth/register" className="btn btn-secondary btn-lg">
              Start Predicting →
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <IconShield size={14} className="text-green-light flex-shrink-0" />
              <span>Non-custodial · KYC protected</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <IconTrendUp size={14} className="text-green-light flex-shrink-0" />
              <span>LMSR-powered fair pricing</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <IconGlobe size={14} className="text-green-light flex-shrink-0" />
              <span>7 East African countries</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
          {STATS.map(s => (
            <div key={s.label} className="stat-chip">
              <div className="stat-chip-icon text-base">{s.icon}</div>
              <div>
                <div className="font-mono text-base font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Countries ticker */}
        <div className="mt-8 flex items-center gap-3 overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wide flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}>Supported</span>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {COUNTRIES.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <span>{c.flag}</span>
                <span>{c.currency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Pay with</span>
          {[
            { label: 'M-Pesa', color: '#00a651', bg: 'rgba(0,166,81,0.1)' },
            { label: 'MTN MoMo', color: '#ffc200', bg: 'rgba(255,194,0,0.1)' },
            { label: 'Airtel', color: '#e40000', bg: 'rgba(228,0,0,0.1)' },
            { label: 'PesaPal', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
          ].map(p => (
            <span key={p.label} className="px-2.5 py-1 rounded-md text-xs font-bold"
              style={{ background: p.bg, color: p.color }}>
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
