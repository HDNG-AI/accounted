'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { WorkspaceComponentProps } from '@/lib/extensions/workspace-registry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TH_CLASS, TD_CLASS } from '@/components/ui/dry-table'
import { getErrorMessage } from '@/lib/errors/get-error-message'
import { cn } from '@/lib/utils'
import UpperHandStatusRail from '@/components/extensions/general/UpperHandStatusRail'
import type {
  UpperHandCase,
  UpperHandCaseStatus,
  UpperHandSeverity,
} from '@/extensions/general/upper-hand/lib/case-types'

const API_BASE = '/api/extensions/ext/upper-hand'

const STATUS_LABEL: Record<UpperHandCaseStatus, string> = {
  open: 'Open',
  acknowledged: 'Being handled',
  accepted_with_note: 'Accepted with note',
  closed: 'Closed',
  reopened: 'Reopened',
}

const STATUS_VARIANT: Record<
  UpperHandCaseStatus,
  'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
> = {
  open: 'outline',
  acknowledged: 'warning',
  accepted_with_note: 'secondary',
  closed: 'success',
  reopened: 'warning',
}

const SEVERITY_LABEL: Record<UpperHandSeverity, string> = {
  info: 'info',
  attention: 'attention',
  blocking: 'blockerande',
}

const SEVERITY_VARIANT: Record<
  UpperHandSeverity,
  'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
> = {
  info: 'secondary',
  attention: 'warning',
  blocking: 'destructive',
}

const SEVERITY_WEIGHT: Record<UpperHandSeverity, number> = {
  blocking: 15,
  attention: 5,
  info: 2,
}

function isResolved(upperHandCase: UpperHandCase): boolean {
  return (
    upperHandCase.status === 'closed' || upperHandCase.status === 'accepted_with_note'
  )
}

function readinessScore(cases: UpperHandCase[]): number {
  const penalty = cases
    .filter((c) => !isResolved(c))
    .reduce((sum, c) => sum + SEVERITY_WEIGHT[c.severity], 0)
  return Math.max(0, 100 - penalty)
}

function formatUpdated(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
}

async function apiRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, body === undefined
    ? { method: 'GET' }
    : {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      (payload as { error?: { message?: string } }).error?.message ?? 'Something went wrong.'
    throw new Error(message)
  }
  return (payload as { data: T }).data
}

export default function UpperHandWorkspace(_props: WorkspaceComponentProps) {
  const [cases, setCases] = useState<UpperHandCase[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [owner, setOwner] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [showAccept, setShowAccept] = useState(false)

  const refresh = useCallback(async () => {
    const data = await apiRequest<UpperHandCase[]>('/cases')
    setCases(data)
    return data
  }, [])

  useEffect(() => {
    refresh()
      .then((data) => {
        setSelectedId((current) => current ?? data[0]?.case_id ?? null)
      })
      .catch((err: unknown) => setError(getErrorMessage(err) || 'Could not read cases.'))
      .finally(() => setLoading(false))
  }, [refresh])

  const openCases = useMemo(() => cases.filter((c) => !isResolved(c)), [cases])
  const resolvedCases = useMemo(() => cases.filter(isResolved), [cases])
  const selected = useMemo(
    () => cases.find((c) => c.case_id === selectedId) ?? null,
    [cases, selectedId]
  )

  useEffect(() => {
    setOwner(selected?.what_closes_it.owner ?? '')
    setDueDate(selected?.what_closes_it.due_date ?? '')
    setNote('')
    setShowAccept(false)
    setMessage(null)
  }, [selected?.case_id, selected?.what_closes_it.owner, selected?.what_closes_it.due_date])

  const run = useCallback(
    async (action: string, path: string, body?: unknown) => {
      setBusyAction(action)
      setError(null)
      setMessage(null)
      try {
        await apiRequest(path, body ?? {})
        const data = await refresh()
        if (action === 'rerun') {
          setMessage('Re-run complete. The case closes only if the pattern no longer holds.')
        }
        setSelectedId((current) => {
          if (current) return current
          return data.find((c) => !isResolved(c))?.case_id ?? data[0]?.case_id ?? null
        })
      } catch (err: unknown) {
        setError(getErrorMessage(err) || 'The action failed.')
      } finally {
        setBusyAction(null)
      }
    },
    [refresh]
  )

  return (
    <div className="space-y-8">
      <UpperHandStatusRail />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Audit-ready</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-display text-3xl tabular-nums">
              {readinessScore(cases)}
              <span className="text-base text-muted-foreground"> /100</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Weighted by severity across open cases. Closing a blocking case raises the number.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Open cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-display text-3xl tabular-nums">{openCases.length}</p>
            <p className="text-xs text-muted-foreground">
              {openCases.filter((c) => c.severity === 'blocking').length} blocking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Closed and accepted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-display text-3xl tabular-nums">{resolvedCases.length}</p>
            <p className="text-xs text-muted-foreground">History is kept for every case.</p>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <p className="text-[12.5px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-[12.5px] text-muted-foreground">{message}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Open cases</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-6">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : openCases.length === 0 ? (
            <p className="p-6 text-[13px] text-muted-foreground">
              No open cases. The reviewers have found nothing that needs action.
            </p>
          ) : (
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className={TH_CLASS}>Role</th>
                  <th className={TH_CLASS}>Severity</th>
                  <th className={TH_CLASS}>Finding</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={TH_CLASS}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {openCases.map((upperHandCase) => (
                  <tr
                    key={upperHandCase.case_id}
                    className={cn(
                      'cursor-pointer hover:bg-secondary/35',
                      selectedId === upperHandCase.case_id && 'bg-secondary/60'
                    )}
                    onClick={() => setSelectedId(upperHandCase.case_id)}
                  >
                    <td className={cn(TD_CLASS, 'whitespace-nowrap')}>
                      {upperHandCase.role}
                    </td>
                    <td className={cn(TD_CLASS, 'whitespace-nowrap')}>
                      <Badge variant={SEVERITY_VARIANT[upperHandCase.severity]}>
                        {SEVERITY_LABEL[upperHandCase.severity]}
                      </Badge>
                    </td>
                    <td className={TD_CLASS}>
                      {upperHandCase.finding}
                      {upperHandCase.needs_recheck ? (
                        <span className="ml-2 text-[11px] text-attn">· re-run recommended</span>
                      ) : null}
                    </td>
                    <td className={cn(TD_CLASS, 'whitespace-nowrap')}>
                      <Badge variant={STATUS_VARIANT[upperHandCase.status]}>
                        {STATUS_LABEL[upperHandCase.status]}
                      </Badge>
                    </td>
                    <td className={cn(TD_CLASS, 'whitespace-nowrap text-muted-foreground')}>
                      {formatUpdated(upperHandCase.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {selected ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">{selected.finding}</CardTitle>
              <Badge variant={STATUS_VARIANT[selected.status]}>
                {STATUS_LABEL[selected.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Role</dt>
                <dd>{selected.role}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Severity</dt>
                <dd>{SEVERITY_LABEL[selected.severity]}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Owner</dt>
                <dd>
                  {selected.what_closes_it.owner ?? 'not set'}
                  {selected.what_closes_it.due_date
                    ? ` · due ${selected.what_closes_it.due_date}`
                    : ''}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Check</dt>
                <dd>{selected.check_id}</dd>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Deviates from</dt>
                <dd>{selected.pattern_deviated_from}</dd>
              </div>
            </dl>

            {isResolved(selected) ? (
              <div className="rounded-lg border border-border bg-card p-3 text-[12.5px]">
                <b>
                  {selected.status === 'closed'
                    ? 'Closed after re-run'
                    : 'Accepted with note'}
                </b>
                <p className="mt-1 text-muted-foreground">{selected.verification}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={busyAction !== null}
                  onClick={() => run('reopen', `/cases/${selected.case_id}/reopen`)}
                >
                  Reopen
                </Button>
              </div>
            ) : (
              <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                  <label className="grid gap-1 text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                    Owner
                    <input
                      className="h-8 rounded-lg border border-border bg-card px-3 text-[13px] normal-case tracking-normal text-foreground"
                      value={owner}
                      onChange={(event) => setOwner(event.target.value)}
                      placeholder="name or role"
                    />
                  </label>
                  <label className="grid gap-1 text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                    Due
                    <input
                      type="date"
                      className="h-8 rounded-lg border border-border bg-card px-3 text-[13px] text-foreground"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                    />
                  </label>
                  <Button
                    disabled={busyAction !== null}
                    onClick={() =>
                      run('acknowledge', `/cases/${selected.case_id}/acknowledge`, {
                        owner,
                        dueDate,
                      })
                    }
                  >
                    Set owner
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    disabled={busyAction !== null}
                    onClick={() => run('rerun', `/cases/${selected.case_id}/rerun`)}
                  >
                    Re-run the reviewer
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busyAction !== null}
                    onClick={() => setShowAccept((value) => !value)}
                  >
                    Accept with note
                  </Button>
                  <span className="text-[12px] text-muted-foreground">
                    A case closes only when a re-run confirms the pattern no longer holds.
                  </span>
                </div>

                {showAccept ? (
                  <div className="space-y-2">
                    <label className="grid gap-1 text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                      Not till beslutet
                      <textarea
                        className="min-h-16 rounded-lg border border-border bg-card p-2 text-[13px] normal-case tracking-normal text-foreground"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="why the deviation is accepted and who decided"
                      />
                    </label>
                    <Button
                      disabled={busyAction !== null || note.trim().length < 8}
                      onClick={() =>
                        run('accept', `/cases/${selected.case_id}/accept`, { note })
                      }
                    >
                      Confirm accept with note
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted-foreground">
                Evidence chain
              </h3>
              <table className="w-full border-collapse text-[12.5px]">
                <thead>
                  <tr>
                    <th className={TH_CLASS}>Type</th>
                    <th className={TH_CLASS}>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.evidence.voucher_ids.map((id) => (
                    <tr key={`v-${id}`}>
                      <td className={TD_CLASS}>voucher</td>
                      <td className={cn(TD_CLASS, 'font-mono')}>{id}</td>
                    </tr>
                  ))}
                  {selected.evidence.document_ids.map((id) => (
                    <tr key={`d-${id}`}>
                      <td className={TD_CLASS}>document</td>
                      <td className={cn(TD_CLASS, 'font-mono')}>{id}</td>
                    </tr>
                  ))}
                  {selected.evidence.event_ids.map((id) => (
                    <tr key={`e-${id}`}>
                      <td className={TD_CLASS}>event</td>
                      <td className={cn(TD_CLASS, 'font-mono')}>{id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted-foreground">
                History
              </h3>
              <ul className="space-y-1 text-[12.5px]">
                {[...selected.history].reverse().map((entry, index) => (
                  <li key={`${entry.at}-${index}`} className="flex gap-3">
                    <span className="font-mono text-muted-foreground">
                      {formatUpdated(entry.at)}
                    </span>
                    <span>
                      {entry.action}
                      {entry.note ? ` · ${entry.note}` : ''}
                      {entry.verification ? ` · ${entry.verification}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {resolvedCases.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Closed and accepted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedCases.map((upperHandCase) => (
              <div
                key={upperHandCase.case_id}
                className="rounded-lg border border-border p-3 text-[13px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <b>{upperHandCase.finding}</b>
                  <Badge variant={STATUS_VARIANT[upperHandCase.status]}>
                    {STATUS_LABEL[upperHandCase.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{upperHandCase.verification}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  disabled={busyAction !== null}
                  onClick={() => run('reopen', `/cases/${upperHandCase.case_id}/reopen`)}
                >
                  Reopen
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
