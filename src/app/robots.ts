import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ats-score-gamma.vercel.app"; // Update with final production URL

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/report/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
