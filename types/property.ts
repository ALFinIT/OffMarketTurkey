export type Property = {
  id: string
  title: string
  location: string
  price: number
  imageUrl?: string
  images?: string[]
  videos?: string[]
  features?: string[]
  highlights?: string[]
  status?: string
  contactEmail?: string
  contactPhone?: string
  calendlyUrl?: string
  whatsapp?: string
  description: string
  beds: number
  baths: number
  area: number
}

export type SupabaseProperty = {
  id: string
  title: string
  location: string
  price: string | number
  status?: string
  description: string
  images?: string[]
  videos?: string[]
  features?: string[]
  highlights?: string[]
  contact_email?: string
  contact_phone?: string
  calendly_url?: string
  bedrooms?: string | number
  bathrooms?: string | number
  area_sqft?: string | number
  created_at?: string
}


