import './critical.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import Script from 'next/script';

// Optimize font loading to reduce CLS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Use 'swap' to prevent text from being invisible while the font loads
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Radioo Music - Official Website',
  description: 'Experience the fusion of classical rock and modern elements',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={inter.className}>
        <MainNav />
        <div className="pt-16">
          {children}
        </div>
        <Footer />
        
        {/* Load non-critical scripts after the page renders */}
        <Script
          src="https://unpkg.com/interactjs/dist/interact.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}