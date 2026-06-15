# Admin Guide

Welcome to the Karbala Platform Admin Guide. This document provides instructions on how to manage the platform's content via the protected Admin Dashboard (`/admin`).

## 🔑 Accessing the Dashboard

1. Navigate to `/admin`.
2. Enter your secure administrator credentials.
3. Upon successful login, you will be redirected to the main dashboard overview.

## 🌙 Managing Nights

The core of the platform is divided into 13 Nights. 

- **Editing a Night:** Click "Edit" on any existing night to modify its title, teaser, central idea, or importance.
- **Draft vs. Published:** Ensure a night is set to `published` only when all its content (Topics, Verses, Narrations) is complete. Draft nights are completely hidden from the public frontend.
- **Content Sections:** Inside the Night Editor, you can manage the nested content:
  - *Topics (المحاور)*
  - *Verses (الآيات)*
  - *Narrations (الروايات)*
  - *Resources (المصادر)*

## 🖼️ Managing Cards (الاقتباسات)

Cards represent easily shareable pieces of content like quotes and reflection questions.
- Navigate to the **Cards** section.
- You can create a new card, link it to a specific Night, and define its type (`quote` or `reflection`).
- Ensure the slug is unique and the status is set to `published` for it to appear on the public cards page.

## 📁 Uploading Media (Audio, PDFs, Covers)

The platform utilizes a unified Media Uploader.
1. When editing a Night, locate the Media section.
2. Use the file input to select your asset.
   - **Audio:** Upload `.mp3` or `.wav` files.
   - **PDF:** Upload `.pdf` files.
   - **Covers:** Upload high-quality `.png` or `.jpg` images.
3. The platform will automatically upload the file to Supabase Storage, generate a public URL, and link it to the current Night.

## 🚀 Publishing Content

1. Always double-check your formatting before publishing.
2. Since Next.js uses aggressive caching for high performance, publishing or editing a night triggers an automatic `revalidatePath` to instantly refresh the public pages without requiring a server restart.
3. If a night's content is incomplete (e.g., Night 10 - المقتل), keep it in `draft` status until you finish writing the content.
