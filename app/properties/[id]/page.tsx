'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { propertiesAPI, enquiriesAPI, type Property } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const data = await propertiesAPI.getById(propertyId)
      setProperty(data)
    } catch (error) {
      console.error('[v0] Error loading property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await enquiriesAPI.create({
        property_id: propertyId,
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone || null,
        message: enquiryForm.message,
        status: 'pending',
      })
      setSubmitSuccess(true)
      setEnquiryForm({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('[v0] Error submitting enquiry:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-foreground/60">Loading property...</p>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="font-sans text-4xl tracking-tight uppercase text-foreground mb-4">Property Not Found</h1>
            <Link href="/properties" className="font-mono text-accent hover:text-foreground transition-colors uppercase">
              Back to Properties
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Link href="/properties" className="font-mono text-xs text-accent tracking-[0.2em] hover:text-foreground transition-colors uppercase mb-4 inline-block">
            ← Back to Properties
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image placeholder */}
            <div className="relative w-full h-96 bg-card border border-border overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-background to-card flex items-center justify-center">
                <span className="font-mono text-foreground/30 text-sm">Property Image</span>
              </div>
            </div>

            {/* Title & Location */}
            <h1 className="font-sans text-5xl md:text-6xl tracking-tight uppercase text-foreground mb-2">
              {property.title}
            </h1>
            <p className="font-mono text-sm text-accent mb-8">
              {property.location}
            </p>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-border">
              <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.1em] block mb-2">Price</span>
              <p className="font-sans text-4xl text-accent font-bold">
                {formatPrice(property.price)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="font-mono text-sm text-accent tracking-[0.25em] uppercase mb-4">About</h2>
              <p className="font-mono text-sm text-foreground/70 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Stats */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="font-mono text-sm text-accent tracking-[0.25em] uppercase mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.1em] block mb-2">Bedrooms</span>
                  <p className="font-sans text-3xl text-foreground">{property.bedrooms}</p>
                </div>
                <div>
                  <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.1em] block mb-2">Bathrooms</span>
                  <p className="font-sans text-3xl text-foreground">{property.bathrooms}</p>
                </div>
                <div>
                  <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.1em] block mb-2">Square Feet</span>
                  <p className="font-sans text-3xl text-foreground">{property.area_sqft.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.1em] block mb-2">Year Built</span>
                  <p className="font-sans text-3xl text-foreground">{property.year_built}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-12 pb-12 border-b border-border">
                <h2 className="font-mono text-sm text-accent tracking-[0.25em] uppercase mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent" />
                      <span className="font-mono text-sm text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-12">
                <h2 className="font-mono text-sm text-accent tracking-[0.25em] uppercase mb-6">Features</h2>
                <div className="flex flex-wrap gap-3">
                  {property.features.map((feature) => (
                    <span key={feature} className="font-mono text-xs bg-card border border-border text-foreground px-4 py-2 uppercase tracking-[0.1em]">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Enquiry Form */}
          <div className="lg:col-span-1">
            <div className="border border-border p-8 sticky top-20">
              <h2 className="font-mono text-sm text-accent tracking-[0.25em] uppercase mb-6">Schedule Viewing</h2>
              
              {submitSuccess ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm text-foreground mb-4">
                    ✓ Thank you! Your enquiry has been submitted.
                  </p>
                  <p className="font-mono text-xs text-foreground/60">
                    We'll contact you shortly with available viewing times.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-foreground/60 uppercase tracking-[0.1em] block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full bg-background border border-border text-foreground placeholder:text-foreground/30 px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-foreground/60 uppercase tracking-[0.1em] block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full bg-background border border-border text-foreground placeholder:text-foreground/30 px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-foreground/60 uppercase tracking-[0.1em] block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full bg-background border border-border text-foreground placeholder:text-foreground/30 px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-foreground/60 uppercase tracking-[0.1em] block mb-2">
                      Message
                    </label>
                    <textarea
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      rows={4}
                      className="w-full bg-background border border-border text-foreground placeholder:text-foreground/30 px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent text-accent-foreground px-4 py-3 font-mono text-xs tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-mono text-xs text-accent tracking-[0.25em] uppercase mb-4">Direct Contact</h3>
                <div className="space-y-2">
                  <p className="font-mono text-sm text-foreground/70">
                    <span className="text-foreground/40">Phone:</span> +1 (212) 555-0100
                  </p>
                  <p className="font-mono text-sm text-foreground/70">
                    <span className="text-foreground/40">Email:</span> concierge@luxuryestate.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
