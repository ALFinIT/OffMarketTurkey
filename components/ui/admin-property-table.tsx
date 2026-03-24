'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

import type { AdminProperty } from '@/types/admin'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type AdminPropertyTableProps = {
  data: AdminProperty[]
  loading?: boolean
  onEdit: (property: AdminProperty) => void
  onDelete: (property: AdminProperty) => Promise<void> | void
  onStatusChange: (property: AdminProperty, status: AdminProperty['status']) => Promise<void> | void
}

const statusTone: Record<AdminProperty['status'], string> = {
  active: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60',
  available: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60',
  sold: 'bg-amber-900/50 text-amber-100 border-amber-700/60',
  hold: 'bg-slate-800 text-slate-100 border-slate-600/60',
}

export function AdminPropertyTable({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: AdminPropertyTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const sortedData = useMemo(
    () => [...data].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')),
    [data],
  )

  const handleStatus = async (property: AdminProperty, status: AdminProperty['status']) => {
    setPendingId(property.id)
    await onStatusChange(property, status)
    setPendingId(null)
  }

  const handleDelete = async (property: AdminProperty) => {
    setPendingId(property.id)
    await onDelete(property)
    setPendingId(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/60">All Properties</p>
          <h3 className="text-xl font-semibold text-foreground">Portfolio</h3>
        </div>
        {loading ? <p className="text-sm text-foreground/60">Loading...</p> : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-28">Preview</TableHead>
              <TableHead className="w-16 text-center">Media</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((property) => {
              const thumb = property.images?.find(Boolean) ?? property.videos?.find(Boolean)
              const isPending = pendingId === property.id
              const mediaCount =
                (property.images?.filter(Boolean).length ?? 0) +
                (property.videos?.filter(Boolean).length ?? 0)
              return (
                <TableRow key={property.id} className="border-border/60">
                  <TableCell>
                    <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
                      {thumb ? (
                        /\.(mp4|mov|m4v|webm)$/i.test(thumb) ? (
                          <div className="flex h-full w-full items-center justify-center bg-black/70 text-[10px] uppercase tracking-[0.18em] text-white/70">
                            Video
                          </div>
                        ) : (
                          <Image
                            src={thumb}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No media
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs text-foreground/70">
                    {mediaCount > 0 ? mediaCount : '—'}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{property.title}</TableCell>
                  <TableCell className="text-foreground/70">{property.location}</TableCell>
                  <TableCell className="text-foreground/70">{property.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn('border px-2 py-1 text-xs uppercase', statusTone[property.status])}
                      >
                        {property.status}
                      </Badge>
                      <select
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={property.status}
                        onChange={(e) => handleStatus(property, e.target.value as AdminProperty['status'])}
                        disabled={isPending}
                        aria-label="Change status"
                      >
                        <option value="available">Available</option>
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="hold">Hold</option>
                      </select>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(property)}
                        disabled={isPending}
                      >
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            disabled={isPending}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background border border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this property?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The listing will be removed from Supabase.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(property)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {!sortedData.length && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No properties yet. Add your first listing to see it here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
