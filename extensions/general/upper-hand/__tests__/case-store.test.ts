import { describe, expect, it } from 'vitest'
import {
  CaseTransitionError,
  applyTransition,
  buildCase,
  sortCases,
} from '../lib/case-store'
import type { UpperHandCase, UpperHandCaseInput } from '../lib/case-types'

function input(overrides: Partial<UpperHandCaseInput> = {}): UpperHandCaseInput {
  return {
    case_id: 'case-1',
    company_id: 'company-1',
    role: 'auditor',
    check_id: 'voucher-without-document',
    situation: 'audit',
    severity: 'blocking',
    due_before: '2026-10-01',
    finding: 'Verifikat utan underlag',
    pattern_deviated_from: 'Varje verifikat ska bära ett dokument.',
    evidence: {
      voucher_ids: ['voucher-1'],
      event_ids: [],
      document_ids: [],
      counterparty_history_ref: null,
    },
    provenance_grade: 'native_full_history',
    what_closes_it: { owner: null, due_date: null },
    idempotency_key: 'auditor|voucher-1|voucher-without-document',
    ...overrides,
  }
}

function sample(overrides: Partial<UpperHandCase> = {}): UpperHandCase {
  return { ...buildCase('company-1', input()), ...overrides }
}

describe('applyTransition', () => {
  it('acknowledges with an owner and clears needs_recheck', () => {
    const current = sample({ needs_recheck: true })
    const updated = applyTransition(current, 'acknowledged', {
      actor: 'user-1',
      owner: 'Anna',
      now: new Date('2026-09-12T10:00:00.000Z'),
    })

    expect(updated.status).toBe('acknowledged')
    expect(updated.what_closes_it.owner).toBe('Anna')
    expect(updated.needs_recheck).toBe(false)
    expect(updated.history).toHaveLength(2)
    expect(updated.history[1].action).toBe('Owner set')
  })

  it('requires an owner or due date to acknowledge', () => {
    expect(() =>
      applyTransition(sample(), 'acknowledged', { actor: 'user-1' })
    ).toThrow(CaseTransitionError)
  })

  it('requires a note of at least 8 characters to accept', () => {
    expect(() =>
      applyTransition(sample(), 'accepted_with_note', {
        actor: 'user-1',
        note: 'kort',
      })
    ).toThrow(/minst 8 tecken|at least 8/)
  })

  it('accepts with a sufficient note and keeps history', () => {
    const updated = applyTransition(sample(), 'accepted_with_note', {
      actor: 'user-1',
      note: 'Styrelsen har beslutat att acceptera avvikelsen.',
    })
    expect(updated.status).toBe('accepted_with_note')
    expect(updated.history.at(-1)?.note).toContain('Styrelsen')
  })

  it('refuses to close without a verification', () => {
    expect(() =>
      applyTransition(sample(), 'closed', { actor: 'system' })
    ).toThrow(CaseTransitionError)
  })

  it('closes with a verification from the re-run', () => {
    const updated = applyTransition(sample(), 'closed', {
      actor: 'system',
      verification: 'Omkörning: samtliga verifikat har underlag.',
    })
    expect(updated.status).toBe('closed')
    expect(updated.verification).toContain('Omkörning')
    expect(updated.history.at(-1)?.verification).toContain('Omkörning')
  })

  it('rejects an invalid transition', () => {
    const accepted = applyTransition(sample(), 'accepted_with_note', {
      actor: 'user-1',
      note: 'Styrelsen har beslutat att acceptera avvikelsen.',
    })
    expect(() =>
      applyTransition(accepted, 'acknowledged', { actor: 'user-1', owner: 'Anna' })
    ).toThrow(/Cannot move case/)
  })

  it('reopens a closed case', () => {
    const closed = applyTransition(sample(), 'closed', {
      actor: 'system',
      verification: 'Omkörning klar.',
    })
    const reopened = applyTransition(closed, 'reopened', { actor: 'user-1' })
    expect(reopened.status).toBe('reopened')
    expect(reopened.history.at(-1)?.action).toBe('Reopened')
  })

  it('is a no-op when the status does not change', () => {
    const current = sample()
    expect(applyTransition(current, 'open', { actor: 'user-1' })).toBe(current)
  })
})

describe('buildCase', () => {
  it('defaults to open with an opening history entry', () => {
    const created = buildCase('company-1', input())
    expect(created.status).toBe('open')
    expect(created.needs_recheck).toBe(false)
    expect(created.history).toHaveLength(1)
    expect(created.history[0].action).toBe('Case opened')
  })
})

describe('sortCases', () => {
  it('orders blocking before attention before info', () => {
    const blocking = sample({ case_id: 'b', severity: 'blocking' })
    const info = sample({ case_id: 'i', severity: 'info' })
    const attention = sample({ case_id: 'a', severity: 'attention' })
    expect(sortCases([info, attention, blocking]).map((c) => c.case_id)).toEqual([
      'b',
      'a',
      'i',
    ])
  })
})
