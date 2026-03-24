'use client'

import { motion } from "framer-motion"

import { Hero } from "@/components/hero"
import { HeroImages } from "@/components/hero-images"
import { MarqueeStrip } from "@/components/marquee-strip"
import { ProgramGrid } from "@/components/program-grid"
import { SplitFeature } from "@/components/split-feature"
import { CtaBlock } from "@/components/cta-block"
import { Footer } from "@/components/footer"
import { OffMarketShowcase } from "@/components/off-market-showcase"

export default function Page() {
  return (
    <motion.main
      className="relative"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Noise overlay for industrial texture */}
      <div className="noise-overlay" aria-hidden="true" />

      <section id="featured">
        <Hero />
        <HeroImages />
      </section>

      <MarqueeStrip />
      <ProgramGrid />

      <section id="about">
        <SplitFeature />
      </section>

      <OffMarketShowcase />

      <section id="contact">
        <CtaBlock />
      </section>
      <Footer />
    </motion.main>
  )
}
