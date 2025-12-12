import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maquillaje Valencia",
  description: "Servicios profesionales de maquillaje para todo tipo de eventos. Experiencia demostrable, resultados duraderos y atención personalizada.",
  keywords: [
    'maquillaje Valencia',
    'maquillaje Massanassa',
    'maquillaje Catarroja',
    'maquillaje novia',
    'maquillaje fiesta',
    'maquillaje artístico',
    'maquillaje profesional',
    'maquillaje evento',
    'maquillaje día',
    'maquillaje noche',
    'maquillaje fallera',
    'maquillaje invitadas',
    'servicio maquillaje',
    'maquilladora profesional',
    'maquillaje duradero',
    'maquillaje bodas',
    'maquillaje comunión',
    'maquillaje eventos especiales',
    'maquillaje personalizado',
    'productos maquillaje calidad'
  ],
  authors: [{ name: "Makeup By Nuri" }],
  openGraph: {
    title: "Maquillaje Profesional en Valencia, Massanassa y Catarroja - MakeupByNuri",
    description: "Servicios profesionales de maquillaje para todo tipo de eventos. Experiencia demostrable, resultados duraderos y atención personalizada.",
    type: "website",
    locale: "es_ES",
    siteName: "Maquillaje Profesional - MakeupByNuri",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquillaje Profesional en Valencia, Massanassa y Catarroja",
    description: "Servicios profesionales de maquillaje para todo tipo de eventos",
  },
  icons: {
    icon: '/favicon.svg', // This will be the path to your favicon during production
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
