import { Check } from "lucide-react";
import Button from "@/app/components/ui/Button";

interface PricingCardProps {
    title: string;
    price: string;
    priceSubtext?: string;
    features: string[];
    catchPhrase?: string;
    isPopular?: boolean;
    buttonText?: string;
    buttonHref?: string;
    buttonVariant?: "primary" | "secondary" | "v3";
    showButton?: boolean;
}

export default function PricingCard({
    title,
    price,
    priceSubtext = "pro Monat",
    features,
    catchPhrase,
    isPopular = false,
    buttonText = "Kontakt aufnehmen",
    buttonHref = "/kontakt",
    buttonVariant,
    showButton=true
}: PricingCardProps) {
    return (
        <div className={`relative bg-white rounded-2xl shadow-xl ring-3 ${buttonVariant === "v3"? "ring-green-200": "ring-gray-200"} p-8 transition-all duration-300 hover:shadow-2xl ${
            isPopular ? 'ring-2 ring-primary scale-105' : ''
        }`}>
            {/* Popular badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Beliebteste Wahl
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {title}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className={"text-sm text-gray-500"}>ab</span>
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">
                        {price}
                    </span>
                    <span className="text-gray-500 text-lg">
                        {priceSubtext}
                    </span>
                </div>
            </div>

            {/* Features list */}
            <div className="mb-8">
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-700 text-left leading-relaxed">
                                    {feature}
                                </span>
                                {index === 0 && catchPhrase && (
                                    <span className="text-gray-500 text-sm mt-1">
                                        {catchPhrase}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Button */}
            <div className={showButton? "w-full" : "hidden"}>
                <Button
                    variant={buttonVariant ? "v3" : "secondary"}
                    text={buttonText} 
                    href={buttonHref}
                />
            </div>

            {/* Background decoration for popular card */}
            {isPopular && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl pointer-events-none"></div>
            )}
        </div>
    );
}