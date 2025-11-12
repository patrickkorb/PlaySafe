import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/app/sections/Navigation";
import Footer from "@/app/sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://playsafe.fit'),
  title: {
    default: "PlaySafe - Sportverletzung Versicherung | Unfallschutz für Freizeitsportler",
    template: "%s | PlaySafe"
  },
  description: "Sportverletzung Versicherung für Freizeitaktivitäten. Schnelle Auszahlung bei Sportverletzungen: Schmerzensgeld bis 2.000€, Invaliditätsleistung bis 1.000.000€. Persönliche Beratung statt Callcenter.",
  keywords: [
    "Sportverletzung Versicherung",
    "Unfallversicherung Sport",
    "Freizeitunfall Versicherung",
    "Schmerzensgeld Sportverletzung",
    "Invaliditätsversicherung Sport",
    "Fußball Versicherung",
    "Ski Versicherung",
    "Unfallschutz Sportler",
    "PlaySafe Versicherung",
    "Signal Iduna Unfallversicherung"
  ],
  authors: [{ name: "PlaySafe - Mike Allmendinger" }],
  creator: "PlaySafe",
  publisher: "PlaySafe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://playsafe.fit",
    title: "PlaySafe - Sportverletzung Versicherung | Unfallschutz für Freizeitsportler",
    description: "Schnelle Auszahlung bei Sportverletzungen: Schmerzensgeld bis 2.000€, Invaliditätsleistung bis 1.000.000€. Persönliche Beratung statt Callcenter.",
    siteName: "PlaySafe",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "PlaySafe - Sportverletzung Versicherung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlaySafe - Sportverletzung Versicherung",
    description: "Schnelle Auszahlung bei Sportverletzungen: Schmerzensgeld bis 2.000€, Invaliditätsleistung bis 1.000.000€.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Füge später deine Google Search Console Verification ID hier ein
    // google: 'deine-google-verification-id',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
    <head>
        {/* Regular tracking code from modal works here too */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
                (function() {
                  var script = document.createElement('script');
                  script.src = 'https://lead-fuchs.vercel.app/track.js';
                  script.dataset.siteId = 'playsafefit-41n8wx9';
                  script.dataset.apiUrl = 'https://lead-fuchs.vercel.app';
                  script.async = true;
                  document.head.appendChild(script);
                })();
              `
            }}
        />
        <script
            defer
            data-website-id="playsafefit-41n8wx9"
            data-domain="playsafe.fit"
            src="https://lead-fuchs.vercel.app/js/script.js">
        </script>
    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navigation />
        {children}
      <Footer />
      </body>
    </html>
  );
}
