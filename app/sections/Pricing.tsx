"use client"

import PricingCard from "@/app/components/PricingCard";
import { motion } from "framer-motion";
import Button from "@/app/components/ui/Button";

export default function Pricing() {
    const pricingPlans = [
        {
            title: "Small",
            price: "10€",
            priceSubtext: "/Monat",
            description: "Der Einstieg in deinen Schutz: Kompakt",
            features: [
                "Schmerzensgeld: 1.000€",
                "Sicherheitsbudget: 30€",
                "Vollinvalidität: 500.000€", 
                "Krankenhaustagegeld: 10€",
                "Schwerverletzung: 2.500€",
                "Happy Holiday: Extra-Schutz im Urlaub",
                "Zahnersatz: 5.000€",
                "Premium Leistungen der SIGNAL IDUNA"
            ],
            isPopular: false
        },
        {
            title: "Medium",
            price: "15€",
            priceSubtext: "/Monat", 
            description: "Mehr Sicherheit für dich und deine Ziele",
            features: [
                "Schmerzensgeld: 1.500€",
                "Sicherheitsbudget: 30€",
                "Vollinvalidität: 750.000€",
                "Krankenhaustagegeld: 30€", 
                "Schwerverletzung: 7.000€",
                "Happy Holiday: Extra-Schutz im Urlaub",
                "Zahnersatz: 5.000€",
                "Premium Leistungen der SIGNAL IDUNA"
            ],
            isPopular: true
        },
        {
            title: "Large", 
            price: "20€",
            priceSubtext: "/Monat",
            description: "Unser Komplettpaket für maximale Sicherheit und Sorgenfreiheit.",
            features: [
                "Schmerzensgeld: 2.000€",
                "Sicherheitsbudget: 30€",
                "Vollinvalidität: 1.000.000€",
                "Krankenhaustagegeld: 50€",
                "Schwerverletzung: 12.000€",
                "Happy Holiday: Extra-Schutz im Urlaub",
                "Zahnersatz: 5.000€",
                "Premium Leistungen der SIGNAL IDUNA"
            ],
            isPopular: false
        }
    ];

    return (
        <motion.section 
            className="py-16 md:py-20 lg:py-28 bg-gray-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16 md:mb-20 lg:mb-24"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
                        Schließe dich heute über <span className="text-primary">5000 zufriedenen</span> Kunden an.
                    </h2>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
                    {pricingPlans.map((plan, index) => (
                        <motion.div 
                            key={index} 
                            className="flex flex-col"
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                        >
                            
                            {/* Pricing Card */}
                            <div className="flex-1">
                                <PricingCard
                                    title={plan.title}
                                    price={plan.price}
                                    priceSubtext={plan.priceSubtext}
                                    features={plan.features}
                                    isPopular={plan.isPopular}
                                    buttonText="Jetzt Angebot erhalten"
                                    buttonHref={`/kontakt?tarif=${plan.title}&preis=${plan.price}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className={"flex flex-col items-center justify-center w-full  text-center mt-16"}>
                    <h2 className={"text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 leading-tight"}>Nicht sicher welcher Tarif zu dir passt?</h2>
                    <h3 className={"text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 mb-8"}>Nutze unseren Rechner und finde deinen individuellen Tarif</h3>
                    <Button text={"Passenden Tarif berechnen"} href={"/rechner"} size={"lg"} className={"max-w-[300px]"}/>
                </div>

            </div>
        </motion.section>
    );
}