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

export const metadata: Metadata = {
  title: "Maquillaje Profesional - Belleza Elegante",
  description: "Servicios profesionales de maquillaje para todo tipo de eventos. Experiencia demostrable, resultados duraderos y atención personalizada.",
  keywords: ["maquillaje", "belleza", "maquilladora profesional", "eventos", "bodas", "fiestas"],
  authors: [{ name: "Maquillaje Profesional" }],
  openGraph: {
    title: "Maquillaje Profesional - Belleza Elegante",
    description: "Servicios profesionales de maquillaje para todo tipo de eventos. Experiencia demostrable y atención personalizada.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquillaje Profesional",
    description: "Servicios profesionales de maquillaje para todo tipo de eventos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
