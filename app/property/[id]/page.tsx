import { cache } from 'react'
import { notFound } from 'next/navigation'

import { PropertyDetail } from '@/components/property-detail'
import { findFallbackProperty, mapSupabaseProperty } from '@/lib/property-data'
import { formatPrice } from '@/lib/formatters'
import { createClient } from '@/utils/supabase/server'
import { type Property, type SupabaseProperty } from '@/types/property'

const getProperty = cache(async (id: string): Promise<Property | null> => {
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    id,
  )

  try {
    if (isUuid) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        const { data: mediaData } = await supabase
          .from('property_media')
          .select('property_id, media_url, media_type')
          .eq('property_id', id)
          .order('display_order', { ascending: true })

        const media = mediaData?.reduce(
          (acc, item: any) => {
            if (!acc[item.property_id]) {
              acc[item.property_id] = { images: [], videos: [] }
            }
            if (item.media_type === 'image') {
              acc[item.property_id].images.push(item.media_url)
            } else if (item.media_type === 'video') {
              acc[item.property_id].videos.push(item.media_url)
            }
            return acc
          },
          {} as Record<string, { images: string[]; videos: string[] }>,
        ) ?? {}

        return mapSupabaseProperty(data as SupabaseProperty, media[id])
      }
    }
  } catch (error) {
    console.warn('[property-page] falling back to static data', error)
  }

  return findFallbackProperty(id) ?? null
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const propertyId = decodeURIComponent(id)
  const property = await getProperty(propertyId)
  if (!property) {
    return {
      title: 'Property not found | Off Market Turkey',
      description: 'The requested property could not be located.',
    }
  }

  return {
    title: `${property.title} | Off Market Turkey`,
    description: `${property.location} — ${formatPrice(property.price)} private listing`,
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const propertyId = decodeURIComponent(id)
  const property = await getProperty(propertyId)

  if (!property) {
    notFound()
  }

  return <PropertyDetail property={property} />
}



