import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Versicherungsrechner - Finde deinen perfekten Tarif für Sportverletzungen",
  description: "Berechne in 3 Schritten deinen individuellen Tarif für die Sportverletzung Versicherung. Perfekter Schutz ab 10€/Monat mit über 500.000€ Leistungen.",
  keywords: [
    "Versicherungsrechner Sport",
    "Unfallversicherung berechnen",
    "Sportverletzung Tarif",
    "Versicherung Kosten Sport"
  ],
  openGraph: {
    title: "Versicherungsrechner - PlaySafe Sportverletzung Versicherung",
    description: "Berechne in 3 Schritten deinen individuellen Tarif für die Sportverletzung Versicherung. Ab 10€/Monat.",
    url: "https://playsafe.fit/rechner",
  },
};

export default function RechnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
