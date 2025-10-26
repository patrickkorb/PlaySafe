import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Informationen zu PlaySafe - Ihre Sportverletzung Versicherung.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Impressum - PlaySafe",
    url: "https://playsafe.fit/impressum",
  },
};

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
