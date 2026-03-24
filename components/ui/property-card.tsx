'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/formatters'
import { type Property } from '@/types/property'

type PropertyCardProps = {
  property: Property
  priority?: boolean
  squareEdges?: boolean
}

export function PropertyCard({ property, priority, squareEdges = false }: PropertyCardProps) {
  let images = property.images?.length ? property.images : [property.imageUrl].filter(Boolean) as string[]
  if (!images.length) {
    images = ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80']
  }
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, 4200)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <Link
      href={`/property/${property.id}`}
      className="group block focus-visible:outline-none"
      aria-label={`View ${property.title}`}
      prefetch
    >
      <motion.div
        layoutId={`card-${property.id}`}
        className={cn(
          'relative h-[420px] w-full overflow-hidden border border-white/10',
          squareEdges ? 'rounded-none' : 'rounded-2xl',
          'bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-black/60 text-left shadow-[0_28px_80px_-45px_rgba(0,0,0,0.85)]',
          'transition duration-500 ease-\\[cubic-bezier(0.22,1,0.36,1)\\]',
          'focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20'
        )}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div layoutId={`image-${property.id}`} className="absolute inset-0">
          <Image
            src={images[active]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            className="h-full w-full object-cover transition duration-[900ms] ease-\\[cubic-bezier(0.22,1,0.36,1)\\] group-hover:scale-110"
            priority={priority}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/80" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
          <div className="absolute inset-0 bg-white/6 mix-blend-screen" />
          <div className="absolute inset-[-35%] bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_45%)] opacity-50" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">{property.location}</p>
            <h3 className="text-2xl font-semibold text-white drop-shadow-md sm:text-3xl">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-lg font-semibold sm:text-xl">{formatPrice(property.price)}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Private listing</p>
            </div>

            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em]">
              <span className="hidden sm:inline">View More</span>
              <div className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 p-2 transition duration-300 group-hover:border-white group-hover:bg-white/20">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1 w-6 transition-all duration-300',
                  i === active ? 'bg-white/80' : 'bg-white/30'
                )}
                aria-hidden
              />
            ))}
          </div>
        )}

        <div
          className={cn(
            'pointer-events-none absolute inset-0 ring-0 ring-white/10 transition duration-500 group-hover:ring-1 group-hover:ring-accent/60',
            squareEdges ? 'rounded-none' : 'rounded-2xl'
          )}
        />
      </motion.div>
    </Link>
  )
}


