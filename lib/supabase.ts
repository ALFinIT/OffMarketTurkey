import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Singleton pattern to prevent multiple client instances during HMR
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

export const supabase = getSupabaseClient()

export type Property = {
  id: string
  title: string
  description: string
  location: string
  price: number
  images?: string[]
  videos?: string[]
  bedrooms: number
  bathrooms: number
  area_sqft: number
  year_built: number
  amenities: string[]
  features: string[]
  status: string
  created_at: string
  updated_at: string
}

export type PropertyMedia = {
  id: string
  property_id: string
  media_url: string
  media_type: 'image' | 'video'
  display_order: number
  created_at: string
}

export type Enquiry = {
  id: string
  property_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
  updated_at: string
}

// Properties API
export const propertiesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Property[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Property
  },

  async getWithMedia(id: string) {
    const property = await this.getById(id)
    const media = await propertyMediaAPI.getByPropertyId(id)
    return { ...property, media }
  },

  async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
    
    if (error) throw error
    return data[0] as Property
  },

  async update(id: string, property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Property
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async search(filters: {
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    location?: string
  }) {
    let query = supabase
      .from('properties')
      .select('*')
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms)
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Property[]
  }
}

// Property Media API
export const propertyMediaAPI = {
  async getByPropertyId(propertyId: string) {
    const { data, error } = await supabase
      .from('property_media')
      .select('*')
      .eq('property_id', propertyId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as PropertyMedia[]
  },

  async create(media: Omit<PropertyMedia, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('property_media')
      .insert([media])
      .select()
    
    if (error) throw error
    return data[0] as PropertyMedia
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('property_media')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Enquiries API
export const enquiriesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (error.message?.includes('Could not find the table')) {
        console.warn('[v0] Enquiries table does not exist yet. Please run database setup.')
        return []
      }
      throw error
    }
    return data as Enquiry[]
  },

  async create(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiry])
      .select()
    
    if (error) {
      if (error.message?.includes('Could not find the table')) {
        console.warn('[v0] Enquiries table does not exist yet. Please run database setup.')
        return null as any
      }
      throw error
    }
    return data[0] as Enquiry
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) {
      if (error.message?.includes('Could not find the table')) {
        console.warn('[v0] Enquiries table does not exist yet. Please run database setup.')
        return null as any
      }
      throw error
    }
    return data[0] as Enquiry
  }
}
