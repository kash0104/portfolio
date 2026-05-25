import type { Metadata } from "next";
import { site } from "@/data/site";

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: `/og/home`, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    knowsAbout: [
      "AWS",
      "Snowflake",
      "Apache Iceberg",
      "dbt",
      "Python",
      "SQL",
      "Data Engineering",
    ],
    sameAs: [site.socials.linkedin, site.socials.github, site.socials.upwork],
  };
}
