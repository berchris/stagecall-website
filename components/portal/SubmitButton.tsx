'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%', padding: '14px',
        background: pending ? 'var(--surface-r)' : 'var(--gold)',
        color: pending ? 'var(--text-sec)' : '#000',
        border: 'none', borderRadius: 12,
        fontSize: 15, fontWeight: 700,
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s',
      }}
    >
      {pending ? (loadingLabel ?? 'Please wait…') : label}
    </button>
  )
}
