# Database Setup Instructions

## What's the Error?

You're seeing this error in the browser console:

```
Could not find the table 'public.enquiries' in the schema cache
```

This means the database tables haven't been created yet. The good news: **the site still works!** You just need to set up the database once.

## How to Fix It

### Option 1: Quick Setup (Recommended)

1. Go to your Supabase dashboard: https://supabase.com
2. Select your project
3. Open **SQL Editor** (left sidebar)
4. Click **+ New Query**
5. Copy and paste the SQL from `SETUP.md` (the entire SQL block)
6. Click **Run** button

That's it! The tables will be created with sample luxury properties.

### Option 2: Using the Node.js Script

From the project root, run:

```bash
npm run setup:db
```

Or:

```bash
pnpm setup:db
```

This will create the tables and insert sample data automatically.

### Option 3: Set Up Storage Bucket (Required for Image Uploads)

**Important:** For image and video uploads to work, you need to create a storage bucket.

1. Go to **Storage** in your Supabase dashboard
2. Click **Create bucket**
3. Name it: `property-media`
4. Make it **Public** (check the box)
5. Click **Create bucket**

## What Gets Created

The SQL creates 3 tables:

1. **properties** - Your luxury property listings
   - id, title, description, location, price
   - bedrooms, bathrooms, area_sqft, year_built
   - amenities, features, status

2. **enquiries** - Client inquiries about properties
   - id, property_id, name, email, phone
   - message, status, created_at

3. **property_media** - Images and videos for properties
   - id, property_id, media_url, media_type, display_order

Plus indexes and security policies for performance and safety.

## What Works Now (Without Setup)

✓ Browse properties list  
✓ View property details  
✓ Filter and sort properties  
✓ Admin dashboard (properties only)  

## What Needs Setup

✗ Enquiry form on property detail pages  
✗ Admin enquiries tab  
✗ Client inquiries (until enquiries table exists)
✗ Image/video uploads (until storage bucket exists)

## After Setup

Everything works! All features enabled:

✓ Create/edit/delete properties in admin  
✓ Upload images and videos for properties
✓ Receive and manage client enquiries  
✓ Full luxury real estate platform  

---

## Troubleshooting

**Still seeing the error?**
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Refresh the page
- Check that you're logged into Supabase with the correct project

**"Permission denied" error?**
- Make sure you're using the Service Role key, not just the Anon key
- Or go to your Supabase project settings and ensure tables are created

**Image uploads not working?**
- Check that the `property-media` storage bucket exists
- Make sure it's set to public
- Check browser console for storage-related errors

**Need help?**
- Check the SQL syntax in `SETUP.md`
- Ensure all Supabase environment variables are set
- Look for any Supabase connection errors in the browser console

