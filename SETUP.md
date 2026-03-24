# Luxury Estate - Setup Guide

## Quick Start

The app is already functional! However, to enable the enquiries feature and populate sample data, follow these steps:

### Step 1: Set Up Supabase Tables

Go to your Supabase project dashboard and open the SQL Editor. Copy and paste the SQL below and execute it.

### Step 2: Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard (left sidebar)
2. Click **Create bucket**
3. Name it: `property-media`
4. Make it **Public** (check the box)
5. Click **Create bucket**

### Step 3: Configure Storage Policies

In the Storage section, go to the `property-media` bucket and create these policies:

**Policy 1: Allow public read access**
- Name: `Public read access`
- Allowed operations: SELECT
- Policy definition: `true` (allow all)

**Policy 2: Allow authenticated uploads**
- Name: `Allow uploads`
- Allowed operations: INSERT, UPDATE
- Policy definition: `true` (allow all for now - you can restrict this later)

## Database Setup

### 1. Create Tables in Supabase

Copy and paste the following SQL into your Supabase SQL editor and run it:

```sql
-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  price BIGINT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  year_built INTEGER,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create property_media table for images and videos
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_url VARCHAR(500) NOT NULL,
  media_type VARCHAR(50) DEFAULT 'image',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_property_media_property_id ON property_media(property_id);
CREATE INDEX idx_enquiries_property_id ON enquiries(property_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to property_media" ON property_media
  FOR SELECT USING (true);

-- Create RLS policies for enquiries (anyone can insert)
CREATE POLICY "Allow public insert enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

-- Insert sample properties
INSERT INTO properties (title, description, location, price, bedrooms, bathrooms, area_sqft, year_built, amenities, features)
VALUES
  (
    'Manhattan Penthouse Suite',
    'Unobstructed views of Central Park and the Hudson River. Private elevator access, floor-to-ceiling windows, smart home integration.',
    'New York, NY',
    8500000,
    5,
    5,
    4200,
    2020,
    ARRAY['Private Elevator', 'Smart Home', 'Gym', 'Wine Cellar'],
    ARRAY['Panoramic Views', 'Marble Flooring', 'High Ceilings', 'Private Terrace']
  ),
  (
    'Malibu Oceanfront Estate',
    'Stunning ocean-front property with resort-style amenities. Private beach access, home theater, infinity pool overlooking the Pacific.',
    'Malibu, CA',
    12000000,
    6,
    7,
    8500,
    2019,
    ARRAY['Beach Access', 'Infinity Pool', 'Theater', 'Wine Cellar'],
    ARRAY['Ocean Views', 'Marble Bathrooms', 'Chef Kitchen', 'Guest House']
  ),
  (
    'Aspen Lakefront Manor',
    'Exclusive lakefront property with ski-in/ski-out access. Heated infinity pool, home automation, breathtaking mountain views.',
    'Aspen, CO',
    6200000,
    4,
    4,
    5600,
    2018,
    ARRAY['Ski Access', 'Lake Access', 'Pool', 'Sauna'],
    ARRAY['Mountain Views', 'Stone Fireplace', 'Radiant Heating', 'Game Room']
  ),
  (
    'Hamptons Historic Mansion',
    'Meticulously restored Victorian estate on 20 acres. Gated community, helipad, championship golf course views.',
    'Hamptons, NY',
    15000000,
    8,
    8,
    12000,
    1920,
    ARRAY['Helipad', 'Golf Course', 'Tennis Court', 'Stables'],
    ARRAY['Historic Architecture', 'Manicured Grounds', 'Guest House', 'Library']
  ),
  (
    'Beverly Hills Ultra Modern Villa',
    'Contemporary luxury villa with smart home technology, underground parking, and infinity pool. Close to premium shopping and dining.',
    'Beverly Hills, CA',
    7800000,
    5,
    6,
    7200,
    2021,
    ARRAY['Smart Home', 'Theater', 'Gym', 'Pool'],
    ARRAY['Modern Design', 'Stainless Steel', 'Automation', 'Rooftop Garden']
  ),
  (
    'Miami Waterfront Luxury Condo',
    'High-rise luxury condo with 24/7 concierge, spa, and world-class amenities. Bay and city views from floor-to-ceiling windows.',
    'Miami, FL',
    5500000,
    3,
    3,
    3800,
    2022,
    ARRAY['Concierge', 'Spa', 'Gym', 'Pool'],
    ARRAY['Bay Views', 'Marble Kitchen', 'Smart Home', 'Private Elevator']
  );
```

### 2. Verify Environment Variables

Your Supabase environment variables should already be set:
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓

### 3. Data Available

**If you skip the SQL setup:**
- ✓ Properties page will work (reads from DB)
- ✓ Property detail pages will work (reads from DB)
- ✗ Admin dashboard will show error for enquiries tab (table doesn't exist)

**After running the SQL:**
- ✓ All features work perfectly
- ✓ 6 sample luxury properties pre-loaded
- ✓ Enquiries feature fully functional

## Project Structure

- **`/app/properties`** - Public property listing page with filtering
- **`/app/properties/[id]`** - Individual property detail page with enquiry form
- **`/app/admin`** - Admin dashboard for managing properties and enquiries
- **`/lib/supabase.ts`** - Supabase client and API functions

## Features

### Properties Page (`/properties`)
- Browse all luxury properties
- Filter by location, price, bedrooms
- Sort by price and newest
- Responsive grid layout

### Property Detail Page (`/properties/[id]`)
- Full property details with amenities and features
- Property enquiry form
- Contact information

### Admin Dashboard (`/admin`)
- **Properties Tab**: Add, edit, delete properties
- **Enquiries Tab**: View and manage property enquiries with status tracking

## Dark Gold Theme

The site uses a dark gold accent color (HSL: 38 73% 43%) for a luxurious feel.
