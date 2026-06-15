import { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants'
import { createServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  // Fetch published night slugs
  const { data: nights } = await supabase
    .from('nights')
    .select('slug, updated_at')
    .eq('status', 'published');

  // Fetch published card slugs
  const { data: cards } = await supabase
    .from('cards')
    .select('slug, updated_at')
    .eq('status', 'published');

  // Base routes
  const routes = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/karbala`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/karbala/cards`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/karbala/majalis`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic night routes
  const nightRoutes = (nights ?? []).map((night) => ({
    url: `${SITE_URL}/karbala/night/${night.slug}`,
    lastModified: new Date(night.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic card routes
  const cardRoutes = (cards ?? []).map((card) => ({
    url: `${SITE_URL}/karbala/cards/${card.slug}`,
    lastModified: new Date(card.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...nightRoutes, ...cardRoutes];
}
