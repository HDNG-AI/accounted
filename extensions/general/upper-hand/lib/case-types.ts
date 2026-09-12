export type UpperHandCaseStatus =
  | 'open'
  | 'acknowledged'
  | 'accepted_with_note'
  | 'closed'
  | 'reopened'

export type UpperHandSeverity = 'info' | 'attention' | 'blocking'

export type UpperHandProvenanceGrade =
  | 'native_full_history'
  | 'migrated_docs_and_history'
  | 'migrated_docs'
  | 'numbers_only'

export interface UpperHandCaseEvidence {
  voucher_ids: string[]
  event_ids: string[]
  document_ids: string[]
  counterparty_history_ref: string | null
}

export interface UpperHandCaseHistoryEntry {
  at: string
  by: string
  action: string
  from: UpperHandCaseStatus
  to: UpperHandCaseStatus
  note: string | null
  verification: string | null
}

export interface UpperHandCase {
  case_id: string
  company_id: string
  role: string
  check_id: string
  situation: string
  severity: UpperHandSeverity
  due_before: string | null
  finding: string
  pattern_deviated_from: string
  evidence: UpperHandCaseEvidence
  provenance_grade: UpperHandProvenanceGrade
  what_closes_it: {
    owner: string | null
    due_date: string | null
  }
  verification: string | null
  status: UpperHandCaseStatus
  idempotency_key: string
  needs_recheck: boolean
  updated_at: string
  history: UpperHandCaseHistoryEntry[]
}

export type UpperHandCaseInput = Omit<
  UpperHandCase,
  'status' | 'verification' | 'needs_recheck' | 'updated_at' | 'history'
> &
  Partial<Pick<UpperHandCase, 'status' | 'verification' | 'needs_recheck' | 'updated_at' | 'history'>>
