export function MarqueeStrip() {
  const words = [
    'OFF-MARKET RELEASE',
    'PRIVATE SHOWINGS',
    'NDA DATA ROOM',
    'WATERFRONT VILLAS',
    'PENTHOUSE COLLECTION',
    'BOSPHORUS VIEWS',
    'LAKE COMO ESTATES',
    'DUBAI MARINA SKYLINES',
    'TURNKEY MANAGEMENT',
    'INVESTOR-READY DOSSIER',
  ]

  return (
    <div className="relative overflow-hidden bg-accent py-2.5 md:py-3" role="marquee" aria-label="Off-market real estate highlights">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...words, ...words].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="font-sans text-lg md:text-3xl text-accent-foreground mx-3 md:mx-10 tracking-wider"
          >
            {word}
            <span className="text-accent-foreground/40 mx-3 md:mx-10">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
