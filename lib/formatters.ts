export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatNumber = (value: number | string | undefined | null) => {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n)) return 'N/A'
  return n.toLocaleString()
}

