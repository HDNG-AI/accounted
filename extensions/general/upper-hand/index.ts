import type { Extension } from '@/lib/extensions/types'
import type { EventPayload } from '@/lib/events/types'
import { upperHandApiRoutes } from './api-routes'
import {
  handleDocumentUploaded,
  handleInvoicePaid,
  handleJournalEntryCommitted,
} from './lib/events'

export const upperHandExtension: Extension = {
  id: 'upper-hand',
  name: 'Upper Hand',
  version: '0.1.0',
  sector: 'general',
  apiRoutes: upperHandApiRoutes,
  eventHandlers: [
    {
      eventType: 'journal_entry.committed',
      handler: (payload: EventPayload<'journal_entry.committed'>) =>
        handleJournalEntryCommitted(payload),
    },
    {
      eventType: 'document.uploaded',
      handler: (payload: EventPayload<'document.uploaded'>) =>
        handleDocumentUploaded(payload),
    },
    {
      eventType: 'invoice.paid',
      handler: (payload: EventPayload<'invoice.paid'>) => handleInvoicePaid(payload),
    },
  ],
}
