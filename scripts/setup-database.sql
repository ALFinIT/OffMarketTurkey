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
