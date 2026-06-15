# Deployment Guide

This document outlines the steps required to deploy the **Karbala Platform** to a production environment using Vercel and Supabase.

## 1. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Run the initial migration script located at `supabase/migrations/001_initial_schema.sql` to create all tables, indexes, enums, and RLS policies.
4. Run the seed script located at `supabase/seed.sql` to populate the database with the 13 nights of content.

## 2. Storage Bucket Setup

You must manually create the following Storage Buckets in your Supabase project:
- `media`: For uploading audio files, PDFs, and cover images.

**Important:** Ensure the `media` bucket is set to **Public** so that users can view and download the files without authentication.

## 3. Environment Variables

Collect the following credentials from your Supabase Dashboard (Settings > API):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Project API Key (anon/public).
- `SUPABASE_SERVICE_ROLE_KEY`: Your Project API Key (service_role/secret). **Never expose this to the client.**

Additionally, configure your Admin credentials. These are used in your middleware and login logic to protect the `/admin` routes:
- `ADMIN_EMAIL`: The email address used to log into the dashboard.
- `ADMIN_PASSWORD`: A secure password.

## 4. Vercel Deployment

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log into [Vercel](https://vercel.com/) and create a **New Project**.
3. Import your repository.
4. In the **Environment Variables** section, add all the variables listed in Step 3.
5. Click **Deploy**. Vercel will automatically detect the Next.js framework, run `npm run build`, and deploy the application.

## 5. Post-Deployment Checks

1. **Verify Public Routes:** Ensure `https://<your-domain>.com` loads correctly and displays the 13 nights.
2. **Verify Admin Access:** Navigate to `/admin`, enter your configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`, and ensure you can access the dashboard.
3. **Upload Media:** Use the Admin Dashboard to upload real images and audio files to ensure Supabase Storage is configured correctly.
