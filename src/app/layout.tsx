import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makeupbynuri.com"),
  title: "Maquillaje Profesional en Valencia, Massanassa y Catarroja | MakeupByNuri",
  description: "Maquilladora profesional en Valencia, Massanassa y Catarroja. Maquillaje para bodas, falleras, invitadas, comuniones y eventos especiales. Resultados duraderos y atención personalizada.",
  authors: [{ name: "Makeup By Nuri" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maquillaje Profesional en Valencia, Massanassa y Catarroja | MakeupByNuri",
    description: "Maquilladora profesional en Valencia. Bodas, falleras, invitadas, comuniones y eventos especiales. Resultados duraderos y atención personalizada.",
    url: "https://makeupbynuri.com",
    type: "website",
    locale: "es_ES",
    siteName: "MakeupByNuri",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maquillaje Profesional - MakeupByNuri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquillaje Profesional en Valencia, Massanassa y Catarroja",
    description: "Maquilladora profesional en Valencia. Bodas, falleras, invitadas, comuniones y eventos especiales.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "MakeupByNuri",
  description:
    "Maquilladora profesional en Valencia, Massanassa y Catarroja. Maquillaje para bodas, falleras, invitadas, comuniones y eventos especiales.",
  url: "https://makeupbynuri.com",
  image: "https://makeupbynuri.com/logo.png",
  telephone: "+34625253343",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valencia",
    addressRegion: "Valencia",
    addressCountry: "ES",
  },
  areaServed: [
    { "@type": "City", name: "Valencia" },
    { "@type": "City", name: "Massanassa" },
    { "@type": "City", name: "Catarroja" },
  ],
  sameAs: [
    "https://www.instagram.com/nuriacatalamkp_",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje de novia" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje fallera" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje de invitadas" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje de comunión" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje artístico" } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
