import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import Script from "next/script";

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
  metadataBase: new URL("https://docs.apps.opentyphoon.ai"),
  openGraph: {
    title: "Typhoon Docs | AI-Powered Document Editor",
    description: "Experience the power of Typhoon AI in this interactive document editor demo. Create, edit and enhance text with AI assistance.",
    url: "https://docs.apps.opentyphoon.ai",
    siteName: "Typhoon Document Helper",
    images: [
      {
        url: "/images/og.jpg",
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
    images: ["/images/og.jpg"],
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
    canonical: "https://docs.apps.opentyphoon.ai",
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
        <Script id="json-loader" type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Typhoon Docs",
            "url": "https://docs.apps.opentyphoon.ai",
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
        <Script id="gtm-script">
          {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WK925XWL');
    `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WK925XWL"
            height={0} width={0} style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
