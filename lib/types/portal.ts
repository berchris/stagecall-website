export type UserRole = 'crew' | 'manager' | 'org_admin'

export type Profile = {
  id: string
  name: string | null
  role: UserRole
  organisation_id: string | null
  is_staff: boolean
  created_at: string
}

export type Organisation = {
  id: string
  name: string
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  phone: string | null
  website: string | null
  email: string | null
  created_at: string
}
