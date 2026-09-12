import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiRouteDefinition, ExtensionContext } from '@/lib/extensions/types'
import { requireWritePermission } from '@/lib/auth/require-write'
import {
  CaseTransitionError,
  applyTransition,
  getCase,
  listCases,
  putCase,
} from './lib/case-store'
import { recheckCase } from './lib/recheck'
import type { UpperHandCase } from './lib/case-types'
import { isLive, listRuns } from './lib/run-store'
import { listPersonas, type PanelStatus } from './lib/panel-status'

const acknowledgeSchema = z
  .object({
    owner: z.string().trim().max(120).optional(),
    dueDate: z.string().trim().max(32).optional(),
  })
  .refine((value) => Boolean(value.owner || value.dueDate), {
    message: 'owner or dueDate is required',
  })

const acceptSchema = z.object({
  note: z.string().trim().min(8).max(2000),
})

function errorResponse(code: string, message: string, status: number): Response {
  return NextResponse.json({ error: { code, message } }, { status })
}

async function requireWritableContext(
  ctx: ExtensionContext | undefined
): Promise<Response | null> {
  if (!ctx) {
    return errorResponse('NO_CONTEXT', 'Extension context saknas.', 500)
  }
  const permission = await requireWritePermission(ctx.supabase, ctx.userId, {
    companyId: ctx.companyId,
  })
  if (!permission.ok) return permission.response
  return null
}

async function readCaseId(request: Request): Promise<string | null> {
  return new URL(request.url).searchParams.get('_id')
}

async function loadCaseOr404(
  ctx: ExtensionContext,
  caseId: string
): Promise<{ upperHandCase: UpperHandCase } | { response: Response }> {
  const upperHandCase = await getCase(ctx.supabase, ctx.companyId, caseId)
  if (!upperHandCase) {
    return { response: errorResponse('CASE_NOT_FOUND', `Ärendet ${caseId} hittades inte.`, 404) }
  }
  return { upperHandCase }
}

function isCaseTransitionError(error: unknown): error is CaseTransitionError {
  return error instanceof CaseTransitionError
}

async function handleListCases(
  _request: Request,
  ctx?: ExtensionContext
): Promise<Response> {
  if (!ctx) return errorResponse('NO_CONTEXT', 'Extension context saknas.', 500)
  const cases = await listCases(ctx.supabase, ctx.companyId)
  return NextResponse.json({ data: cases })
}

async function handleAcknowledge(
  request: Request,
  ctx?: ExtensionContext
): Promise<Response> {
  const guard = await requireWritableContext(ctx)
  if (guard) return guard
  const context = ctx as ExtensionContext

  const caseId = await readCaseId(request)
  if (!caseId) return errorResponse('CASE_ID_REQUIRED', 'Ärendets id saknas.', 400)

  const parsed = acknowledgeSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return errorResponse('INVALID_BODY', 'Ange ansvarig eller förfallodatum.', 400)
  }

  const loaded = await loadCaseOr404(context, caseId)
  if ('response' in loaded) return loaded.response

  try {
    const updated = applyTransition(loaded.upperHandCase, 'acknowledged', {
      actor: context.userId,
      owner: parsed.data.owner ?? null,
      dueDate: parsed.data.dueDate ?? null,
    })
    await putCase(context.supabase, context.userId, context.companyId, updated)
    return NextResponse.json({ data: updated })
  } catch (error) {
    if (isCaseTransitionError(error)) {
      return errorResponse(error.code, error.message, 400)
    }
    throw error
  }
}

async function handleAccept(
  request: Request,
  ctx?: ExtensionContext
): Promise<Response> {
  const guard = await requireWritableContext(ctx)
  if (guard) return guard
  const context = ctx as ExtensionContext

  const caseId = await readCaseId(request)
  if (!caseId) return errorResponse('CASE_ID_REQUIRED', 'Ärendets id saknas.', 400)

  const parsed = acceptSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return errorResponse('NOTE_REQUIRED', 'En not på minst 8 tecken krävs.', 400)
  }

  const loaded = await loadCaseOr404(context, caseId)
  if ('response' in loaded) return loaded.response

  try {
    const updated = applyTransition(loaded.upperHandCase, 'accepted_with_note', {
      actor: context.userId,
      note: parsed.data.note,
    })
    await putCase(context.supabase, context.userId, context.companyId, updated)
    return NextResponse.json({ data: updated })
  } catch (error) {
    if (isCaseTransitionError(error)) {
      return errorResponse(error.code, error.message, 400)
    }
    throw error
  }
}

async function handleReopen(
  request: Request,
  ctx?: ExtensionContext
): Promise<Response> {
  const guard = await requireWritableContext(ctx)
  if (guard) return guard
  const context = ctx as ExtensionContext

  const caseId = await readCaseId(request)
  if (!caseId) return errorResponse('CASE_ID_REQUIRED', 'Ärendets id saknas.', 400)

  const loaded = await loadCaseOr404(context, caseId)
  if ('response' in loaded) return loaded.response

  try {
    const updated = applyTransition(loaded.upperHandCase, 'reopened', {
      actor: context.userId,
    })
    await putCase(context.supabase, context.userId, context.companyId, updated)
    return NextResponse.json({ data: updated })
  } catch (error) {
    if (isCaseTransitionError(error)) {
      return errorResponse(error.code, error.message, 400)
    }
    throw error
  }
}

async function handleRerun(
  request: Request,
  ctx?: ExtensionContext
): Promise<Response> {
  const guard = await requireWritableContext(ctx)
  if (guard) return guard
  const context = ctx as ExtensionContext

  const caseId = await readCaseId(request)
  if (!caseId) return errorResponse('CASE_ID_REQUIRED', 'Ärendets id saknas.', 400)

  const loaded = await loadCaseOr404(context, caseId)
  if ('response' in loaded) return loaded.response

  const outcome = await recheckCase(context.supabase, loaded.upperHandCase)

  if (!outcome.resolved) {
    return NextResponse.json({ data: { case: loaded.upperHandCase, outcome } })
  }

  const updated = applyTransition(loaded.upperHandCase, 'closed', {
    actor: 'system',
    verification: outcome.verification,
  })
  await putCase(context.supabase, context.userId, context.companyId, updated)
  return NextResponse.json({ data: { case: updated, outcome } })
}

async function handleStatus(_request: Request, ctx?: ExtensionContext): Promise<Response> {
  if (!ctx) return errorResponse('NO_CONTEXT', 'Extension context saknas.', 500)
  const runs = await listRuns(ctx.supabase, ctx.companyId)
  const personas = listPersonas().map((p) => {
    const last = runs.find((r) => r.persona === p.id) ?? null
    return { ...p, last_run: last, live: last ? isLive(last) : false }
  })
  const status: PanelStatus = {
    personas,
    live: personas.some((p) => p.live),
    models: { analysis: 'qwen3.6:35b-a3b', control: 'gemma4:31b', provider: 'Staik · SE' },
    access: 'Läsnyckel: inga skrivverktyg exponerade',
    generated_at: new Date().toISOString(),
  }
  return NextResponse.json(status)
}

export const upperHandApiRoutes: ApiRouteDefinition[] = [
  { method: 'GET', path: '/status', handler: handleStatus },
  { method: 'GET', path: '/cases', handler: handleListCases },
  { method: 'POST', path: '/cases/:id/acknowledge', handler: handleAcknowledge },
  { method: 'POST', path: '/cases/:id/accept', handler: handleAccept },
  { method: 'POST', path: '/cases/:id/rerun', handler: handleRerun },
  { method: 'POST', path: '/cases/:id/reopen', handler: handleReopen },
]
