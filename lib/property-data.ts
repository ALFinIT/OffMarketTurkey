import { Property, SupabaseProperty } from '@/types/property'

export const fallbackProperties: Property[] = [
  {
    id: 'bosphorus-horizon',
    title: 'Bosphorus Horizon Penthouse',
    location: 'Istanbul, Turkey',
    price: 19900000,
    images: [
      'https://images.unsplash.com/photo-1541185933-1f636884b265?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1543810310-55982a0e28a8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477676526845-9dac8b84256d?auto=format&fit=crop&w=1200&q=80',
    ],
    videos: ['https://www.youtube.com/watch?v=3gHBo9sfurb'],
    description:
      'Exclusive Bosphorus-facing penthouse with private elevator, rooftop terrace, and 24/7 luxury management services.',
    beds: 4,
    baths: 4.5,
    area: 5200,
  },
  {
    id: 'bodrum-vista',
    title: 'Bodrum Vista Villa',
    location: 'Bodrum, Turkey',
    price: 13500000,
    images: [
      'https://images.unsplash.com/photo-1572120360610-d971b9dd8b10?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1542672417-4907f75c90c4?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Cliffside villa above the Aegean with infinity pool, private pier, and immersive sunrise views.',
    beds: 6,
    baths: 6.5,
    area: 7800,
  },
  {
    id: 'desert-pavilion',
    title: 'Sonoran Pavilion',
    location: 'Scottsdale, USA',
    price: 8600000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Rammed-earth wings and glass galleries framing canyon sunsets, negative-edge pool, and private spa courtyard.',
    beds: 5,
    baths: 5.5,
    area: 6400,
  },
  {
    id: 'aurora-sky',
    title: 'Aurora Sky Residence',
    location: 'Vancouver, Canada',
    price: 7050000,
    images: [
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Double-height great room with North Shore silhouettes, smoked oak millwork, and floating stair over reflecting pool.',
    beds: 4,
    baths: 4,
    area: 5100,
  },
  {
    id: 'waterline-estate',
    title: 'Waterline Estate',
    location: 'Lake Como, Italy',
    price: 14600000,
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=70&sat=-10',
    ],
    description:
      'Stone-clad volumes with private jetty, terraced lawns, infinity pool, and custom Italian lighting.',
    beds: 7,
    baths: 7.5,
    area: 9200,
  },
  {
    id: 'sierra-glass',
    title: 'Sierra Glasshouse',
    location: 'Aspen, USA',
    price: 10100000,
    images: [
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Cantilevered alpine retreat with floor-to-ceiling glazing, radiant concrete floors, and cedar spa deck.',
    beds: 5,
    baths: 5,
    area: 5800,
  },
  {
    id: 'harbourline-loft',
    title: 'Harbourline Loft',
    location: 'Singapore',
    price: 7950000,
    images: [
      'https://images.unsplash.com/photo-1529429617124-aeeac2cd9064?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80&sat=-25',
    ],
    description:
      'Duplex loft above Marina Bay with bronze, travertine, smoked glass, and double-height loggia.',
    beds: 4,
    baths: 4.5,
    area: 4300,
  },
  {
    id: 'marina-crest',
    title: 'Marina Crest Duplex',
    location: 'Dubai Marina, UAE',
    price: 11800000,
    images: [
      'https://images.unsplash.com/photo-1484156818044-c040038b0710?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Sky duplex with sculptural stair, wraparound terraces, and private plunge pool facing the Gulf.',
    beds: 5,
    baths: 6,
    area: 6700,
  },
  {
    id: 'atelier-loft',
    title: 'Atelier Loft',
    location: 'Manhattan, USA',
    price: 5400000,
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=70&sat=-15',
    ],
    description:
      "Converted garment atelier with 13' ceilings, steel windows, gallery-white walls, and winter garden.",
    beds: 3,
    baths: 3,
    area: 3100,
  },
  {
    id: 'pacific-grove',
    title: 'Pacific Grove Retreat',
    location: 'Big Sur, USA',
    price: 10600000,
    images: [
      'https://images.unsplash.com/photo-1472220625704-91e1462799b2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505692069463-08ad25f3ffe8?auto=format&fit=crop&w=1600&q=70',
    ],
    description:
      'Timber pavilions among redwoods with horizon deck, suspended fireplace lounge, and cliffside soak.',
    beds: 4,
    baths: 4.5,
    area: 5400,
  },
  {
    id: 'matterhorn-chalet',
    title: 'Matterhorn Chalet',
    location: 'Zermatt, Switzerland',
    price: 13400000,
    images: [
      'https://images.unsplash.com/photo-1465773629805-06107f7c55f1?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1432297984334-70719cbbac2f?auto=format&fit=crop&w=1600&q=80',
    ],
    description:
      'Brushed spruce chalet with double-height glazing to the Matterhorn and subterranean hammam.',
    beds: 6,
    baths: 6.5,
    area: 7600,
  },
  {
    id: 'ivory-dune',
    title: 'Ivory Dune Sanctuary',
    location: 'Malibu, USA',
    price: 17200000,
    images: [
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1400&q=70&sat=-15',
    ],
    description:
      'Beachfront minimalism with microcement interiors, frameless glass, and dune-level pool into the Pacific.',
    beds: 5,
    baths: 5.5,
    area: 6000,
  },
]

export const mapSupabaseProperty = (
  item: SupabaseProperty,
  media?: { images?: string[]; videos?: string[] },
): Property => {
  const priceNumber = Number((item.price ?? '').toString().replace(/[^0-9.]/g, ''))
  const mediaImages = media?.images ?? []
  const mediaVideos = media?.videos ?? []
  const allImages = [...mediaImages, ...(Array.isArray(item.images) ? item.images : [])]

  return {
    id: item.id,
    title: item.title,
    location: item.location,
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    imageUrl:
      allImages[0] ??
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
    images: allImages,
    videos: mediaVideos,
    features: Array.isArray(item.features) ? item.features : undefined,
    highlights: Array.isArray(item.highlights) ? item.highlights : undefined,
    contactEmail: item.contact_email ?? undefined,
    contactPhone: item.contact_phone ?? undefined,
    calendlyUrl: item.calendly_url ?? undefined,
    description: item.description,
    beds: Number(item.bedrooms || 0),
    baths: Number(item.bathrooms || 0),
    area: Number(item.area_sqft || 0),
  }
}

export const findFallbackProperty = (id: string) =>
  fallbackProperties.find((property) => property.id === id)


