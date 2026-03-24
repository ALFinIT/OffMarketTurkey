import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('Setting up storage bucket...')

    // Create storage bucket for property media
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      console.error('Error listing buckets:', listError)
    } else {
      const bucketExists = buckets?.some(bucket => bucket.name === 'property-media')
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('property-media', {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 10485760, // 10MB
        })
        if (createError) {
          console.error('Error creating storage bucket:', createError)
        } else {
          console.log('✓ Storage bucket "property-media" created')
        }
      } else {
        console.log('✓ Storage bucket "property-media" already exists')
      }
    }

    console.log('Setting up database...')

    // Create tables
    const { error: propertiesError } = await supabase.rpc('exec_sql', {
      sql: `
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

        CREATE TABLE IF NOT EXISTS property_media (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
          media_url VARCHAR(500) NOT NULL,
          media_type VARCHAR(50) DEFAULT 'image',
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );

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

        CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
        CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
        CREATE INDEX IF NOT EXISTS idx_property_media_property_id ON property_media(property_id);
        CREATE INDEX IF NOT EXISTS idx_enquiries_property_id ON enquiries(property_id);
        CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

        ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
        ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
        ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Allow public read access to properties" ON properties
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Allow public read access to property_media" ON property_media
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Allow public insert enquiries" ON enquiries
          FOR INSERT WITH CHECK (true);
      `
    })

        CREATE POLICY IF NOT EXISTS "Allow public read access to properties" ON properties
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Allow public insert enquiries" ON enquiries
          FOR INSERT WITH CHECK (true);
      `
    })

    if (propertiesError) {
      console.error('Error creating tables:', propertiesError)
      return
    }

    // Insert sample data
    const sampleProperties = [
      {
        title: 'Manhattan Penthouse Suite',
        description: 'Unobstructed views of Central Park and the Hudson River. Private elevator access, floor-to-ceiling windows, smart home integration.',
        location: 'New York, NY',
        price: 8500000,
        bedrooms: 5,
        bathrooms: 5,
        area_sqft: 4200,
        year_built: 2020,
        amenities: ['Private Elevator', 'Smart Home', 'Gym', 'Wine Cellar'],
        features: ['Panoramic Views', 'Marble Flooring', 'High Ceilings', 'Private Terrace'],
        status: 'available'
      },
      {
        title: 'Malibu Oceanfront Estate',
        description: 'Stunning ocean-front property with resort-style amenities. Private beach access, home theater, infinity pool overlooking the Pacific.',
        location: 'Malibu, CA',
        price: 12000000,
        bedrooms: 6,
        bathrooms: 7,
        area_sqft: 8500,
        year_built: 2019,
        amenities: ['Beach Access', 'Infinity Pool', 'Theater', 'Wine Cellar'],
        features: ['Ocean Views', 'Marble Bathrooms', 'Chef Kitchen', 'Guest House'],
        status: 'available'
      },
      {
        title: 'Aspen Lakefront Manor',
        description: 'Exclusive lakefront property with ski-in/ski-out access. Heated infinity pool, home automation, breathtaking mountain views.',
        location: 'Aspen, CO',
        price: 6200000,
        bedrooms: 4,
        bathrooms: 4,
        area_sqft: 5600,
        year_built: 2018,
        amenities: ['Ski Access', 'Lake Access', 'Pool', 'Sauna'],
        features: ['Mountain Views', 'Stone Fireplace', 'Radiant Heating', 'Game Room'],
        status: 'available'
      },
      {
        title: 'Hamptons Historic Mansion',
        description: 'Meticulously restored Victorian estate on 20 acres. Gated community, helipad, championship golf course views.',
        location: 'Hamptons, NY',
        price: 15000000,
        bedrooms: 8,
        bathrooms: 8,
        area_sqft: 12000,
        year_built: 1920,
        amenities: ['Helipad', 'Golf Course', 'Tennis Court', 'Stables'],
        features: ['Historic Architecture', 'Manicured Grounds', 'Guest House', 'Library'],
        status: 'available'
      },
      {
        title: 'Beverly Hills Ultra Modern Villa',
        description: 'Contemporary luxury villa with smart home technology, underground parking, and infinity pool. Close to premium shopping and dining.',
        location: 'Beverly Hills, CA',
        price: 7800000,
        bedrooms: 5,
        bathrooms: 6,
        area_sqft: 7200,
        year_built: 2021,
        amenities: ['Smart Home', 'Theater', 'Gym', 'Pool'],
        features: ['Modern Design', 'Stainless Steel', 'Automation', 'Rooftop Garden'],
        status: 'available'
      },
      {
        title: 'Miami Waterfront Luxury Condo',
        description: 'High-rise luxury condo with 24/7 concierge, spa, and world-class amenities. Bay and city views from floor-to-ceiling windows.',
        location: 'Miami, FL',
        price: 5500000,
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 3800,
        year_built: 2022,
        amenities: ['Concierge', 'Spa', 'Gym', 'Pool'],
        features: ['Bay Views', 'Marble Kitchen', 'Smart Home', 'Private Elevator'],
        status: 'available'
      }
    ]

    const { error: insertError } = await supabase
      .from('properties')
      .insert(sampleProperties)

    if (insertError) {
      console.log('Sample data may already exist or error:', insertError.message)
    } else {
      console.log('✓ Sample properties inserted')
    }

    console.log('✓ Database setup completed successfully!')
  } catch (error) {
    console.error('Setup error:', error)
    process.exit(1)
  }
}

setupDatabase()
