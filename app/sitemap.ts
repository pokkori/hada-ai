import { MetadataRoute } from "next";

const BASE_URL = "https://hada-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BASE_URL;
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tool`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
  const slugs = [
    "hada-type-diagnosis-ai",
    "kanso-hada-care-method",
    "acne-prone-skin-care",
    "sensitive-skin-daily-care",
    "hada-barrier-repair",
    "summer-skin-care-routine",
    "winter-dry-skin-care",
    "beauty-ingredient-analysis",
    "skin-age-improvement",
    "hada-trouble-diagnosis",
  ];
  const kw: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/keywords/${slug}`,
    lastModified: new Date("2026-03-31"),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [...staticPages, ...kw];
}
