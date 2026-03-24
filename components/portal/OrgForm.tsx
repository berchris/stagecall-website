import FormField from './FormField'
import SubmitButton from './SubmitButton'
import type { Organisation } from '@/lib/types/portal'

export default function OrgForm({
  org,
  action,
  error,
  success,
}: {
  org?: Partial<Organisation>
  action: (formData: FormData) => Promise<void>
  error?: string
  success?: boolean
}) {
  return (
    <form action={action}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
          Organisation details
        </p>
        <FormField label="Organisation name" name="name" defaultValue={org?.name} required placeholder="e.g. The Grand Theatre" />
        <FormField label="Email" name="email" type="email" defaultValue={org?.email} placeholder="info@yourorg.com" />
        <FormField label="Phone" name="phone" defaultValue={org?.phone} placeholder="+31 6 12345678" />
        <FormField label="Website" name="website" defaultValue={org?.website} placeholder="https://yourorg.com" />
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
          Address
        </p>
        <FormField label="Street address" name="address" defaultValue={org?.address} placeholder="Theaterlaan 12" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="City" name="city" defaultValue={org?.city} placeholder="Amsterdam" />
          <FormField label="Postal code" name="postal_code" defaultValue={org?.postal_code} placeholder="1234 AB" />
        </div>
        <FormField label="Country" name="country" defaultValue={org?.country} placeholder="Netherlands" />
      </div>

      {error && (
        <p style={{ color: 'var(--urgent)', fontSize: 14, marginBottom: 16 }}>{error}</p>
      )}
      {success && (
        <p style={{ color: 'var(--teal)', fontSize: 14, marginBottom: 16 }}>Saved successfully.</p>
      )}

      <SubmitButton label="Save changes" loadingLabel="Saving…" />
    </form>
  )
}
