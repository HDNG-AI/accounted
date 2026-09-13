import { describe, expect, it } from 'vitest'
import { modelsFromRuns } from '../api-routes'
import type { UpperHandRun } from '../lib/run-store'

const run = (over: Partial<UpperHandRun>): UpperHandRun => ({
  run_id: 'r', persona: 'auditor', checks: [], model: 'm-analysis', control_model: 'm-control',
  started_at: '2026-09-13T10:00:00Z', finished_at: null, status: 'done',
  turns: null, tool_calls: null, findings: null, controls_ok: null, gate_ok: null, ...over,
})

describe('modelsFromRuns', () => {
  it('shows the latest run models and provider, not a hard-coded vendor', () => {
    const m = modelsFromRuns([run({ provider: 'HDNG Core' }), run({ model: 'old', provider: 'Staik · SE' })])
    expect(m).toEqual({ analysis: 'm-analysis', control: 'm-control', provider: 'HDNG Core' })
  })
  it('falls back to the route defaults before any run', () => {
    const m = modelsFromRuns([])
    expect(m.analysis).toBe('qwen3.6:35b-a3b')
    expect(m.control).toBe('gemma4:31b')
    expect(typeof m.provider).toBe('string')
  })
  it('tolerates runs recorded before provider existed', () => {
    expect(modelsFromRuns([run({})]).provider).toBeTruthy()
  })
})
