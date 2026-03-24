'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarRange,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Ruler,
  Sparkles,
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

const detailItems = [
  { key: 'beds', label: 'Beds', icon: BedDouble },
  { key: 'baths', label: 'Baths', icon: Bath },
  { key: 'area', label: 'Area', icon: Ruler },
] as const

type ParsedVideo =
  | { type: 'embed'; url: string; original: string }
  | { type: 'file'; url: string; original: string }
  | { type: 'link'; url: string; original: string }

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

const parseVideo = (url: string): ParsedVideo | null => {
  if (!url) return null
  const embed = toEmbedUrl(url)
  if (embed) return { type: 'embed', url: embed, original: url }
  const isFile = /\.(mp4|webm|mov|m4v)$/i.test(url)
  if (isFile) return { type: 'file', url, original: url }
  return { type: 'link', url, original: url }
}

type PropertyDetailProps = {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
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
      property.area ? `${formatNumber(property.area)} sq ft` : null,
      property.location ?? null,
      'Private showings',
      'Turnkey management',
    ].filter(Boolean) as string[]

  return (
    <motion.main
      className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,214,137,0.08),transparent_28%)]" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/properties"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.18em] text-white transition hover:border-accent/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
          <span className="hidden rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100 sm:inline-flex">
            Private release
          </span>
        </div>

        <motion.div
          className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[16/8] w-full overflow-hidden">
            <Image
              src={
                galleryImages[0] ??
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80'
              }
              alt={property.title}
              fill
              priority
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4 text-xs uppercase tracking-[0.26em] text-white/70 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {property.location}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80">
                Exclusive Listing
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-6 flex flex-wrap items-end justify-between gap-4 px-6 sm:px-8">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/70">{property.location}</p>
                <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">{property.title}</h1>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full border border-accent/30 bg-accent/20 px-4 py-2 text-lg font-semibold text-white shadow-inner">
                  {formatPrice(property.price)}
                </span>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Private showing on request</p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 sm:p-8 md:grid-cols-[1.2fr_0.95fr]">
            <div className="space-y-7">
              <motion.div
                className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-white shadow-inner"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-foreground/60">Overview</p>
                <p className="text-base leading-relaxed text-white/80">{property.description}</p>
              </motion.div>

              {galleryImages.length ? (
                <motion.div
                  className="space-y-3"
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
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
                                loading={index === 0 ? 'eager' : 'lazy'}
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
                </motion.div>
              ) : null}

              {videos.length ? (
                <motion.div
                  className="space-y-3"
                  initial={{ y: 26, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
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
                </motion.div>
              ) : null}

              {highlights.length ? (
                <motion.div
                  className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-white shadow-inner"
                  initial={{ y: 26, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
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
                </motion.div>
              ) : null}
            </div>

            <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
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

              <div className="space-y-4 rounded-2xl border border-accent/25 bg-accent/5 p-4 text-white shadow-lg">
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
        </motion.div>
      </div>
    </motion.main>
  )
}


