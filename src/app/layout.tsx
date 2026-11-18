import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSiteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name}｜企事业单位食堂承包与团餐运营`,
    template: `%s｜${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["食堂承包", "团餐运营", "食材配送", "厨房设计", "惠州餐饮管理"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: site.name,
    title: `${site.name}｜让每一餐都有据可循`,
    description: site.description,
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "衡膳餐饮厨房团队协同备餐",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123b32",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
