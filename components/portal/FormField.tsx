export default function FormField({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor={name}
        style={{
          display: 'block', fontSize: 11, fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--text-sec)', marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        className="portal-input"
        style={{
          width: '100%', background: 'var(--surface-r)',
          border: '1px solid var(--border)', borderRadius: 10,
          padding: '12px 14px', color: 'var(--text)',
          fontSize: 15, outline: 'none',
        }}
      />
    </div>
  )
}
