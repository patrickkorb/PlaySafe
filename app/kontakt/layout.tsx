import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt - Persönliche Beratung zur Sportverletzung Versicherung",
  description: "Kontaktiere Mike Allmendinger für eine persönliche Beratung zur Sportverletzung Versicherung. Direkter Kontakt statt Callcenter. Tel: 0162 9436375",
  openGraph: {
    title: "Kontakt - PlaySafe Sportverletzung Versicherung",
    description: "Persönliche Beratung zur Sportverletzung Versicherung. Direkter Kontakt statt Callcenter.",
    url: "https://playsafe.fit/kontakt",
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
