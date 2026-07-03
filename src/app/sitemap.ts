import type { MetadataRoute } from "next";

const baseUrl = "https://revo.onokun.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/diagnosis/entry",
    "/full-diagnosis",
    "/monitor",
    "/monitor/feedback",
    "/monitor/growth",
    "/monitor/match",
    "/monitor/role",
    "/monitor/team",
    "/revo",
    "/revo111",
    "/revo111/result",
    "/team",
    "/types",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
