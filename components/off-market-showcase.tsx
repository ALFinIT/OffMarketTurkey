'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGroup } from 'framer-motion'

import { PropertyCard } from '@/components/ui/property-card'
import { fallbackProperties, mapSupabaseProperty } from '@/lib/property-data'
import { createClient } from '@/utils/supabase/client'
import { type Property, type SupabaseProperty } from '@/types/property'

export function OffMarketShowcase() {
  const supabase = useMemo(() => createClient(), [])
  const [properties, setProperties] = useState<Property[]>(fallbackProperties)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .in('status', ['active', 'available'])
          .order('created_at', { ascending: false })

        if (error) throw error

        const propertyIds = (data as SupabaseProperty[] | null)?.map((p) => p.id) ?? []
        let mediaMap: Record<string, { images: string[]; videos: string[] }> = {}

        if (propertyIds.length > 0) {
          const { data: mediaData } = await supabase
            .from('property_media')
            .select('property_id, media_url, media_type')
            .in('property_id', propertyIds)
            .order('display_order', { ascending: true })

          mediaMap = mediaData?.reduce(
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
        }

        const mapped = (data as SupabaseProperty[] | null)?.map((item) =>
          mapSupabaseProperty(item, mediaMap[item.id]),
        ) ?? []

        const seenIds = new Set(mapped.map((p) => p.id))
        const filler = fallbackProperties.filter((p) => !seenIds.has(p.id))
        const merged = [...mapped, ...filler].slice(0, 24)

        setProperties(merged.length ? merged : fallbackProperties)
        setVisibleCount(12)
      } catch (err) {
        console.warn('[off-market] using fallback', err)
        setProperties(fallbackProperties)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [supabase])

  return (
    <section id="properties" className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent/80">Off-Market Properties</p>
          <h2 className="text-4xl uppercase tracking-tight sm:text-5xl">Exclusive investment opportunities not listed publicly</h2>
        </div>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] rounded-2xl border border-border/60 bg-card/40"
                />
              ))
            : properties.slice(0, visibleCount).map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={index < 4}
                  squareEdges
                />
              ))}
        </div>

        {!loading && properties.length > visibleCount && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="rounded-none border border-accent/50 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.22em] text-foreground transition hover:border-accent hover:bg-white/10"
            >
              Load More
            </button>
          </div>
        )}
      </LayoutGroup>
    </section>
  )
}


