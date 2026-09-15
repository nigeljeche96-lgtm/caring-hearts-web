/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BookingNotificationProps {
  fullName?: string
  email?: string
  phone?: string
  providerName?: string
  sessionType?: string
  sessionDate?: string
  sessionTime?: string
  sessionMode?: string
  reason?: string
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={row}>
    <span style={rowLabel}>{label}: </span>
    <span style={rowValue}>{value}</span>
  </Text>
)

export const BookingNotificationEmail = ({
  fullName = 'A client',
  email = '—',
  phone = '—',
  providerName = '—',
  sessionType = '—',
  sessionDate = '—',
  sessionTime = '—',
  sessionMode = 'Virtual',
  reason = '—',
}: BookingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New booking from {fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Session Booking</Heading>
        <Text style={text}>
          A new counselling session has been booked through the website.
        </Text>
        <Section style={card}>
          <Row label="Client" value={fullName} />
          <Row label="Email" value={email} />
          <Row label="Phone" value={phone} />
          <Hr style={hr} />
          <Row label="Professional" value={providerName} />
          <Row label="Session type" value={sessionType} />
          <Row label="Date" value={sessionDate} />
          <Row label="Time" value={sessionTime} />
          <Row label="Mode" value={sessionMode} />
          <Hr style={hr} />
          <Row label="Reason" value={reason} />
        </Section>
        <Text style={footer}>
          World Changers Mental Health Care Organisation
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px',
  maxWidth: '600px',
  borderRadius: '12px',
}
const h1 = { color: '#034694', fontSize: '22px', margin: '0 0 16px' }
const text = { color: '#374151', fontSize: '15px', lineHeight: '1.6' }
const card = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
}
const row = { margin: '4px 0', fontSize: '14px' }
const rowLabel = { color: '#6b7280' }
const rowValue = { color: '#111827', fontWeight: 600 }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
const footer = { color: '#9ca3af', fontSize: '12px', marginTop: '24px' }

export const template = {
  component: BookingNotificationEmail,
  displayName: 'Booking Notification',
  subject: (data: BookingNotificationProps) =>
    `New Booking — ${data?.sessionType || 'Session'} with ${data?.providerName || 'a professional'}`,
  previewData: {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+27 11 000 0000',
    providerName: 'Ms Mimmy Ledwaba',
    sessionType: 'Individual Counselling',
    sessionDate: '2026-10-01',
    sessionTime: '10:00',
    sessionMode: 'Virtual',
    reason: 'Anxiety support',
  },
} satisfies TemplateEntry
