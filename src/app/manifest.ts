import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "衡膳餐饮",
    short_name: "衡膳",
    description: "企事业单位食堂承包与团餐运营演示网站",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f3ee",
    theme_color: "#173c32",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
