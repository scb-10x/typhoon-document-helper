import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typhoon Docs | AI-Powered Document Editing",
  description: "Experience the power of Typhoon AI in this interactive document editor demo. Create, edit and enhance text with AI assistance. #BuiltWithTyphoon",
  keywords: "Typhoon AI, document editor, AI document, text editor, AI assistant, Typhoon demo, document helper",
  authors: [{ name: "Typhoon Team" }],
  metadataBase: new URL("https://docs.opentyphoon.ai"),
  openGraph: {
    title: "Typhoon Docs | AI-Powered Document Editor",
    description: "Experience the power of Typhoon AI in this interactive document editor demo. Create, edit and enhance text with AI assistance.",
    url: "https://docs.opentyphoon.ai",
    siteName: "Typhoon Document Helper",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Typhoon Docs - AI-Powered Document Editor",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typhoon Docs | AI-Powered Document Editor",
    description: "Experience the power of Typhoon AI in this interactive document editor demo. Create, edit and enhance your documents with AI assistance.",
    creator: "@opentyphoon",
    images: ["/images/twitter-image.png"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://docs.opentyphoon.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Typhoon Docs",
            "url": "https://docs.opentyphoon.ai",
            "description": "AI-powered document editor demonstration built with Typhoon",
            "applicationCategory": "DeveloperApplication, BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Typhoon",
              "url": "https://opentyphoon.ai"
            }
          })
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
