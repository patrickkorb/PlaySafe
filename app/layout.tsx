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
  title: "PlaySafe - Deine Absicherung bei Freizeit-Verletzungen",
  description: "PlaySafe für Freizeitaktivitäten. Schmerzensgeld, Invaliditätsleistung und mehr. Persönliche Beratung statt Callcenter.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
        {/* Regular tracking code from modal works here too */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
                (function() {
                  var script = document.createElement('script');
                  script.src = 'https://lead-fuchs.vercel.app/track.js';
                  script.dataset.siteId = 'playsafefit-41n8wx9';
                  script.async = true;
                  document.head.appendChild(script);
                })();
              `
            }}
        />
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
