'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'
import type { AdminProperty } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { AdminPropertyForm } from '@/components/ui/admin-property-form'
import { AdminPropertyTable } from '@/components/ui/admin-property-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const CACHE_KEY = 'omt-properties-cache'

const mapSupabaseProperty = (
  prop: any,
  mediaMap: Record<string, { images: string[]; videos: string[] }>,
): AdminProperty => ({
  id: prop.id,
  title: prop.title ?? '',
  location: prop.location ?? '',
  price: (prop.price ?? '').toString(),
  status: prop.status ?? 'available',
  description: prop.description ?? '',
  images: mediaMap[prop.id]?.images || (Array.isArray(prop.images) ? prop.images : []),
  videos: mediaMap[prop.id]?.videos || (Array.isArray(prop.videos) ? prop.videos : []),
  beds: prop.bedrooms != null ? String(prop.bedrooms) : '',
  baths: prop.bathrooms != null ? String(prop.bathrooms) : '',
  area: prop.area_sqft != null ? String(prop.area_sqft) : '',
  created_at: prop.created_at ?? null,
})

const loadCache = (): AdminProperty[] | null => {
  if (typeof window === 'undefined') return null
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const parsed = JSON.parse(cached)
    return Array.isArray(parsed) ? (parsed as AdminProperty[]) : null
  } catch (error) {
    console.warn('[admin dashboard] failed to read cache', error)
    return null
  }
}

const saveCache = (data: AdminProperty[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('[admin dashboard] failed to write cache', error)
  }
}

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const { toast } = useToast()

  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProperty | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          title: 'Unable to load properties',
          description: error.message,
          variant: 'destructive',
        })
        const cached = loadCache()
        if (cached) {
          setProperties(cached)
          setLoading(false)
          return
        }
        setLoading(false)
        return
      }

      // Fetch media for all properties
      const propertyIds = (data ?? []).map((p: any) => p.id)
      let mediaMap: Record<string, { images: string[]; videos: string[] }> = {}

      if (propertyIds.length > 0) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('property_media')
          .select('property_id, media_url, media_type')
          .in('property_id', propertyIds)
          .order('display_order', { ascending: true })

        if (!mediaError && mediaData) {
          mediaMap = mediaData.reduce(
            (acc: any, item: any) => {
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
          )
        }
      }

      // Populate media for each property and normalize shape
      const propertiesWithMedia: AdminProperty[] = (data ?? []).map((prop: any) =>
        mapSupabaseProperty(prop, mediaMap),
      )

      const finalList =
        propertiesWithMedia.length > 0 ? propertiesWithMedia : loadCache() ?? []

      setProperties(finalList)
      saveCache(finalList)
      setLoading(false)
    }

    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const handleCreated = (property: AdminProperty) => {
    setProperties((prev) => {
      const next = [property, ...prev]
      saveCache(next)
      return next
    })
  }

  const handleUpdated = (property: AdminProperty) => {
    setProperties((prev) => {
      const next = prev.map((item) => (item.id === property.id ? property : item))
      saveCache(next)
      return next
    })
    setEditOpen(false)
    setEditing(null)
  }

  const handleStatusChange = async (property: AdminProperty, status: AdminProperty['status']) => {
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', property.id)
      .select()
      .single()

    if (error) {
      toast({ title: 'Status update failed', description: error.message, variant: 'destructive' })
      return
    }
    setProperties((prev) => {
      const next = prev.map((item) =>
        item.id === property.id ? { ...item, ...data } : item,
      )
      saveCache(next)
      return next
    })
    toast({ title: 'Status updated' })
  }

  const handleDelete = async (property: AdminProperty) => {
    const { error } = await supabase.from('properties').delete().eq('id', property.id)
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' })
      return
    }
    setProperties((prev) => {
      const next = prev.filter((item) => item.id !== property.id)
      saveCache(next)
      return next
    })
    toast({ title: 'Property deleted' })
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Admin Panel</p>
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="self-start">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-lg">
            <AdminPropertyForm onSuccess={handleCreated} />
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/60">
                  Editing
                </p>
                <h3 className="text-xl font-semibold text-foreground">Quick Edit</h3>
              </div>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!editing}>
                    {editing ? 'Edit selection' : 'Select from table'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-background">
                  <DialogHeader>
                    <DialogTitle>Edit property</DialogTitle>
                  </DialogHeader>
                  {editing ? (
                    <AdminPropertyForm
                      property={editing}
                      onSuccess={handleUpdated}
                      onCancel={() => setEditOpen(false)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">Pick a property from the table to edit.</p>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <p className="mt-3 text-sm text-foreground/60">
              Select a property in the table to load it here for editing.
            </p>
          </div>
        </div>

        <AdminPropertyTable
          data={properties}
          loading={loading}
          onEdit={(property) => {
            setEditing(property)
            setEditOpen(true)
          }}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
      <Toaster />
    </main>
  )
}

