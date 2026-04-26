import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ang Jin Wei — Data Engineer & AI Systems Builder",
  description:
    "Portfolio of Ang Jin Wei. Data Engineer and AI Systems Builder based in Singapore. Building scalable data systems, knowledge graphs, and AI pipelines.",
  keywords: [
    "Data Engineer",
    "AI Engineer",
    "GraphRAG",
    "Neo4j",
    "AWS",
    "Python",
    "Singapore",
  ],
  openGraph: {
    title: "Ang Jin Wei — Data Engineer & AI Systems Builder",
    description:
      "Data Engineer and AI Systems Builder based in Singapore. Building scalable data systems, knowledge graphs, and AI pipelines.",
    url: "https://xsolstice1.github.io/jwang",
    siteName: "Ang Jin Wei Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ang Jin Wei — Data Engineer & AI Systems Builder",
    description:
      "Data Engineer and AI Systems Builder based in Singapore. Building scalable data systems, knowledge graphs, and AI pipelines.",
  },
  metadataBase: new URL("https://xsolstice1.github.io"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
