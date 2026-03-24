'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Bath,
  BedDouble,
  CalendarRange,
  Mail,
  MapPin,
  MessageCircle,
  Play,
  Ruler,
  Sparkles,
  X,
  Phone,
} from 'lucide-react'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { formatNumber, formatPrice } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { type Property } from '@/types/property'

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@offmarketturkey.com'
const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+90 212 555 0101'
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/offmarketturkey/15min'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}` : null

type PropertyModalProps = {
  property: Property | null
  onClose: () => void
}

const detailItems = [
  { key: 'beds', label: 'Beds', icon: BedDouble },
  { key: 'baths', label: 'Baths', icon: Bath },
  { key: 'area', label: 'Area', icon: Ruler },
] as const

const toEmbedUrl = (url: string) => {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`
    }
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video/${u.pathname.replace('/', '')}`
    }
  } catch {
    return null
  }
  return null
}

type ParsedVideo =
  | { type: 'embed'; url: string; original: string }
  | { type: 'file'; url: string; original: string }
  | { type: 'link'; url: string; original: string }

const parseVideo = (url: string): ParsedVideo | null => {
  if (!url) return null
  const embed = toEmbedUrl(url)
  if (embed) return { type: 'embed', url: embed, original: url }
  const isFile = /\.(mp4|webm|mov|m4v)$/i.test(url)
  if (isFile) return { type: 'file', url, original: url }
  return { type: 'link', url, original: url }
}

export function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const portalRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    setMounted(true)
    if (typeof document === 'undefined') return
    const existing = document.getElementById('property-modal-root') as HTMLElement | null
    const node = existing ?? document.createElement('div')
    if (!existing) {
  node.id = 'property-modal-root'
  node.style.position = 'fixed'      // â† fixed
  node.style.top = '0'
  node.style.left = '0'
  node.style.width = '100vw'
  node.style.height = '0'
  node.style.zIndex = '9999'
  document.body.appendChild(node)
}
    portalRef.current = node

    return () => {
      if (!existing && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }
  }, [])

  if (!property || !mounted || !portalRef.current) return null

  const galleryImages =
    property.images?.length && property.images[0]
      ? property.images
      : [property.imageUrl].filter(Boolean) as string[]

  const videos = (property.videos ?? []).map(parseVideo).filter(Boolean) as ParsedVideo[]
  const primaryVideo = videos.find((item) => item.type === 'embed' || item.type === 'file')

  const highlights =
    property.highlights?.filter(Boolean).slice(0, 4) ??
    [
      property.location ? `Prime ${property.location}` : 'Private, NDA-only release',
      property.area ? `${formatNumber(property.area)} sq ft of interior space` : 'Expansive layout',
      property.beds ? `${property.beds} bedroom configuration` : 'Multi-suite flexibility',
      'Dossier & financials available under NDA',
    ]

  const featureChips =
    property.features?.filter(Boolean).slice(0, 8) ??
    [
      property.beds ? `${property.beds} beds` : null,
      property.baths ? `${property.baths} baths` : null,
      property.area ? `${property.area.toLocaleString()} sq ft` : null,
      property.location ?? null,
      'Private showings',
      'Turnkey management',
    ].filter(Boolean) as string[]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-16 sm:px-8 sm:py-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} style={{ cursor: 'pointer' }} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-amber-300/20 bg-neutral-950 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/60 bg-black/80 text-amber-200 transition hover:border-amber-300 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Close property details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute inset-x-0 top-0 z-20 h-10 border-b border-amber-300/30 bg-black/70 px-5 flex items-center justify-between text-xs font-mono tracking-wide text-amber-200">
          <span>Property details</span>
          <span className="uppercase">{property.location}</span>
        </div>

        <div
          className="relative h-[240px] sm:h-[300px] md:h-[340px] overflow-hidden"
        >
          <Image
            src={
              galleryImages[0] ??
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80'
            }
            alt={property.title}
            fill
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" />
          <div className="absolute inset-x-0 bottom-6 flex flex-wrap items-center justify-between gap-3 px-6 text-white">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-white/70">
                <MapPin className="h-3.5 w-3.5" />
                {property.location}
              </p>
              <h3 className="text-2xl font-semibold sm:text-3xl">{property.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">
                Exclusive
              </span>
              <span className="rounded-full border border-accent/30 bg-accent/20 px-4 py-2 text-sm font-semibold text-white shadow-inner">
                {formatPrice(property.price)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-8 overflow-y-auto p-6 sm:p-8 md:grid-cols-[1.15fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-white shadow-inner">
              <p className="text-sm uppercase tracking-[0.24em] text-foreground/60">Overview</p>
              <p className="text-base leading-relaxed text-white/80">{property.description}</p>
            </div>

            {galleryImages.length ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Gallery
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <Carousel opts={{ align: 'start', loop: galleryImages.length > 1 }}>
                    <CarouselContent className="p-2">
                      {galleryImages.map((src, index) => (
                        <CarouselItem key={src} className="basis-full sm:basis-1/1">
                          <div className="relative aspect-video overflow-hidden rounded-xl">
                            <Image
                              src={src}
                              alt={`${property.title} ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {galleryImages.length > 1 ? (
                      <>
                        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 border-white/30 bg-black/50 text-white hover:bg-black/70" />
                        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 border-white/30 bg-black/50 text-white hover:bg-black/70" />
                      </>
                    ) : null}
                  </Carousel>
                </div>
              </div>
            ) : null}

            {videos.length ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  <Play className="h-4 w-4 text-accent" />
                  Video
                </div>
                {primaryVideo ? (
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
                    {primaryVideo.type === 'embed' ? (
                      <iframe
                        src={primaryVideo.url}
                        className="h-[260px] w-full md:h-[320px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Property video"
                      />
                    ) : (
                      <video
                        src={primaryVideo.url}
                        className="h-[260px] w-full rounded-xl object-cover md:h-[320px]"
                        controls
                        playsInline
                        muted
                        preload="metadata"
                      />
                    )}
                  </div>
                ) : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  {videos.map((video, index) => (
                    <a
                      key={video.original + index}
                      href={video.original}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-accent/70 hover:bg-white/[0.06]"
                    >
                      <Play className="h-4 w-4 text-accent" />
                      <span>Media {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {highlights.length ? (
              <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-white shadow-inner">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">Investment highlights</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {highlights.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/80"
                    >
                      <Sparkles className="mt-[3px] h-4 w-4 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="grid grid-cols-3 gap-3">
              {detailItems.map((item) => {
                const Icon = item.icon
                const value =
                  item.key === 'area'
                    ? `${formatNumber(property.area)} sq ft`
                    : item.key === 'baths'
                      ? formatNumber(property.baths)
                      : formatNumber(property.beds)

                return (
                  <div
                    key={item.key}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white"
                  >
                    <Icon className="h-4 w-4 text-white/70" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">{item.label}</span>
                    <span className="text-base font-semibold">{value}</span>
                  </div>
                )
              })}
            </div>

            {featureChips.length ? (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">Features</p>
                <div className="flex flex-wrap gap-2">
                  {featureChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-4 rounded-2xl border border-accent/25 bg-accent/5 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Private viewing</p>
                  <p className="text-lg font-semibold text-white">{formatPrice(property.price)}</p>
                </div>
                <CalendarRange className="h-6 w-6 text-accent" />
              </div>
              <div className="flex flex-col gap-2 text-sm text-white/80">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(property.title)}%20-%20Viewing%20request`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-accent/60 hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {property.contactEmail ?? CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:${property.contactPhone ?? CONTACT_PHONE}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-accent/60 hover:bg-white/[0.08]"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {property.contactPhone ?? CONTACT_PHONE}
                </a>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={property.calendlyUrl ?? CALENDLY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-accent/60 bg-accent/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white transition hover:border-accent hover:bg-accent/30"
                  >
                    <CalendarRange className="h-4 w-4" />
                    Book a meeting
                  </a>
                  {WHATSAPP_URL ? (
                    <a
                      href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white transition hover:border-white/40"
                    >
                      <MessageCircle className="h-4 w-4 text-accent" />
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              className={cn(
                'rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent',
                'px-4 py-3 text-sm text-white/70'
              )}
            >
              Private briefings by appointment only. NDA-backed data room and financials available upon request.
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


