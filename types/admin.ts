export type AdminProperty = {
  id: string
  title: string
  location: string
  price: string
  status: 'active' | 'available' | 'sold' | 'hold'
  description: string
  images: string[]
  videos: string[]
  beds: string
  baths: string
  area: string
  created_at: string | null
}
