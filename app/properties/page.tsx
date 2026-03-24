import { OffMarketShowcase } from '@/components/off-market-showcase'

export default function PropertiesPage() {
  return (
    <main className="relative">
      <div className="noise-overlay" aria-hidden="true" />
      <OffMarketShowcase />
    </main>
  )
}
