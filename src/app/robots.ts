import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Coherente con el `robots: { index: false }` de esas páginas.
      disallow: ["/portal", "/legal/"],
    },
    sitemap: `${SITIO.url}/sitemap.xml`,
    host: SITIO.url,
  };
}
