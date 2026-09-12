'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PanelStatus } from '@/extensions/general/upper-hand/lib/panel-status'

const API_BASE = '/api/extensions/ext/upper-hand'
const REFRESH_MS = 15_000

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('sv-SE', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

export default function UpperHandStatusRail() {
  const [status, setStatus] = useState<PanelStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = () =>
      fetch(`${API_BASE}/status`, { credentials: 'include' })
        .then(async (r) => {
          if (!r.ok) throw new Error(`status ${r.status}`)
          return (await r.json()) as PanelStatus
        })
        .then((s) => { if (!cancelled) { setStatus(s); setError(null) } })
        .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Kunde inte läsa status') })
    load()
    const t = setInterval(load, REFRESH_MS)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  return (
    <section aria-label="Granskare" className="rounded-none border-2 border-foreground bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground px-4 py-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.12em] text-muted-foreground">
            <span
              aria-hidden="true"
              className={cn(
                'inline-block h-2 w-2 rounded-full ring-2 ring-foreground',
                status?.live ? 'animate-pulse bg-lime-300' : 'bg-transparent'
              )}
            />
            {status?.live ? 'Granskning pågår' : 'Granskare i vila'}
          </span>
          {status && (
            <span className="font-mono text-muted-foreground">
              {status.models.analysis} analys · {status.models.control} kontroll · {status.models.provider}
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{status?.access ?? (error ? `Status: ${error}` : 'Läser status…')}</span>
      </div>
      <div className="grid gap-px bg-foreground sm:grid-cols-3">
        {(status?.personas ?? []).map((p) => (
          <div key={p.id} className="bg-card px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">{p.title}</span>
              <span className="font-mono text-xs text-muted-foreground">{p.checks.length} kontroller</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.checks.map((c) => (
                <Badge key={c} variant="outline" className="rounded-none font-mono text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {p.live
                ? `Kör sedan ${fmtTime(p.last_run?.started_at)}`
                : p.last_run
                  ? `Senast ${fmtTime(p.last_run.finished_at ?? p.last_run.started_at)} · ${p.last_run.turns ?? '–'} turer · ${p.last_run.tool_calls ?? '–'} anrop · ${p.last_run.findings ?? '–'} fynd${p.last_run.gate_ok === false ? ' · språkgate stoppade' : ''}`
                  : 'Ingen körning registrerad'}
            </p>
          </div>
        ))}
        {status && status.personas.length === 0 && (
          <div className="bg-card px-4 py-3 text-sm text-muted-foreground">Inga personas hittades i skills/personas.</div>
        )}
      </div>
    </section>
  )
}
