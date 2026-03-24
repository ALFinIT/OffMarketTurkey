"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Linkedin, Instagram, Youtube, Mail, Phone } from "lucide-react"

type AdminProfile = {
  id: string
  name: string
  title: string
  description: string
  image: string
  phone: string
  email: string
  linkedin: string
}

const adminProfiles: AdminProfile[] = [
  {
    id: "admin1",
    name: "Merve Yıldırım",
    title: "Senior Investment Director",
    description: "Specializes in luxury Bosphorus portfolios and high-net-worth client strategy.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    phone: "+90 532 123 4567",
    email: "merve@offmarketturkey.com",
    linkedin: "https://www.linkedin.com/in/merveyildirim",
  },
  {
    id: "admin2",
    name: "Emre Aksoy",
    title: "Head of Sales",
    description: "Experienced in drone site inspections and prime Turkish coastal placements.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    phone: "+90 532 987 6543",
    email: "emre@offmarketturkey.com",
    linkedin: "https://www.linkedin.com/in/emreaksoy",
  },
  {
    id: "admin3",
    name: "Leyla Demir",
    title: "Client Relations Manager",
    description: "Dedicated to VIP service, anonymized listings, and international investor onboarding.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    phone: "+90 533 555 1212",
    email: "leyla@offmarketturkey.com",
    linkedin: "https://www.linkedin.com/in/leylademir",
  },
]

type AdminSideProps = {
  admin: AdminProfile
  isBack?: boolean
}

function AdminSide({ admin, isBack = false }: AdminSideProps) {
  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900/90 border border-amber-400/40 transition-all duration-300 group-hover:z-50"
      style={{
        backfaceVisibility: 'hidden',
        transform: isBack ? 'rotateY(180deg)' : undefined,
      }}
    >
      <div className="h-[60%] relative overflow-hidden transition-all duration-500">
        <Image
          src={admin.image}
          alt={admin.name}
          fill
          className="object-cover object-[50%_25%] grayscale group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 transition-all duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-amber-500/45 transition-all duration-500" />
      </div>
      <div className="flex-1 p-4 pb-5 text-white flex flex-col justify-between gap-4 min-h-[240px]">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-tight text-foreground">{admin.name}</h3>
          <p className="text-[12px] uppercase tracking-[0.16em] text-amber-200">{admin.title}</p>
          <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-3">{admin.description}</p>
        </div>
        <div className="space-y-1 text-sm text-foreground/85">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-amber-300" />
            <a href={`tel:${admin.phone}`} className="hover:text-amber-200 transition-colors">{admin.phone}</a>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-300" />
            <a href={`mailto:${admin.email}`} className="hover:text-amber-200 transition-colors">{admin.email}</a>
          </p>
        </div>
        <div className="flex items-center justify-start gap-3 pt-2">
          <a href={admin.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-amber-200/80 bg-white/10 text-white hover:bg-amber-300/20 hover:border-amber-200 transition-all">
            <Linkedin className="h-4 w-4" strokeWidth={2} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-pink-200/80 bg-white/10 text-white hover:bg-pink-400/20 hover:border-pink-200 transition-all">
            <Instagram className="h-4 w-4" strokeWidth={2} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-red-200/80 bg-white/10 text-white hover:bg-red-400/20 hover:border-red-200 transition-all">
            <Youtube className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  )
}

export function CtaBlock() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const [flipped, setFlipped] = useState<string | null>('front')

  return (
    <section id="contact" ref={ref} className="relative px-4 md:px-8 py-8 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden="true">
        <span className="font-sans text-[40vw] md:text-[35vw] text-foreground/[0.02] leading-none">01</span>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className={visible ? "brutal-reveal" : "opacity-0"}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
            <div className="text-center lg:text-left">
              <span className="font-mono text-[9px] md:text-[10px] text-accent tracking-[0.25em] md:tracking-[0.3em] uppercase block mb-4 md:mb-8">
                [Ready To Explore]
              </span>
              <h2 className="font-sans text-[10vw] sm:text-5xl md:text-[10vw] lg:text-[8vw] tracking-tighter text-foreground leading-[0.85] uppercase mb-3 md:mb-12">
                Schedule Your
                <br />
                <span className="text-accent">Private</span> Consultation.
              </h2>
              <p className="font-mono text-[9px] md:text-sm text-muted-foreground max-w-sm md:max-w-lg mx-auto lg:mx-0 leading-relaxed mb-4 md:mb-12">
                Discover off-market properties tailored to your lifestyle.
                <br />
                Direct access. Exclusive opportunities. White-glove service.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 md:gap-4">
                <a
                  href="tel:+1234567890"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-accent text-accent-foreground font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase px-6 md:px-10 py-3.5 md:py-5 hover-glitch transition-transform hover:scale-[1.02] min-h-[48px]"
                >
                  Call Now
                </a>
                <a
                  href="/#properties"
                  className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-foreground text-foreground font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase px-6 md:px-10 py-3.5 md:py-5 hover:bg-foreground hover:text-background transition-colors min-h-[48px]"
                >
                  Browse Properties
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div
            className="cursor-pointer p-2 group"
            role="button"
            tabIndex={0}
            aria-label="Toggle admin card face"
            onClick={() => setFlipped((prev) => (prev === 'front' ? 'back' : 'front'))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setFlipped((prev) => (prev === 'front' ? 'back' : 'front'))
                }}
              >
                <div className="relative w-[320px] h-[560px] mt-6" style={{ perspective: '1400px' }}>
                  <div
                    className="relative w-full h-full rounded-3xl border border-amber-400/35 bg-black/70 shadow-[0_18px_38px_-18px_rgba(0,0,0,0.85)] transition-transform duration-700"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flipped === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <AdminSide admin={adminProfiles[0]} />
                    <AdminSide admin={adminProfiles[1]} isBack />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
