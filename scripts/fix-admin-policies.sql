-- Add missing RLS policies for admin operations
-- These allow INSERT, UPDATE, DELETE operations on properties and property_media

-- Properties table policies
CREATE POLICY "Allow all operations on properties" ON properties
  FOR ALL USING (true) WITH CHECK (true);

-- Property media table policies
CREATE POLICY "Allow all operations on property_media" ON property_media
  FOR ALL USING (true) WITH CHECK (true);

-- Enquiries table policies (already has insert, add others)
CREATE POLICY "Allow public read enquiries" ON enquiries
  FOR SELECT USING (true);

CREATE POLICY "Allow public update enquiries" ON enquiries
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete enquiries" ON enquiries
  FOR DELETE USING (true);