// Registry of transactional email templates.
// Each entry maps a templateName (used by send-transactional-email) to a
// React Email component plus its subject line.

import type * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as bookingNotification } from './booking-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-notification': bookingNotification,
}
