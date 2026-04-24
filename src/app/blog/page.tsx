import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MakeupByNuri',
  description: 'Consejos de maquillaje, tendencias y novedades de MakeupByNuri. Maquilladora profesional en Valencia, Massanassa y Catarroja.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Volver al inicio
          </a>
          <span className="text-sm font-semibold text-foreground">Blog</span>
          <div className="w-28" />
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <a href="/" className="inline-block">
          <img src="/logo-texto.png" alt="MakeupByNuri" className="h-48 mx-auto" />
        </a>
      </div>

      {/* Blog content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div id="soro-widget-container" />
      </div>

      <Script
        src="https://diyseo.online/embed.js"
        data-site="cmocfgxrt0001nt4a6ssnue71"
        data-base-path="/blog"
        data-theme="light"
        strategy="afterInteractive"
      />
    </main>
  );
}
