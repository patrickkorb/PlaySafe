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
  description: "Sportschutz für Freizeitaktivitäten. Schmerzensgeld, Invaliditätsleistung und mehr. Persönliche Beratung statt Callcenter.",
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
