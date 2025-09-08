"use client"
import Link from "next/link";
import { MapPinned } from "lucide-react";
import Button from "@/app/components/ui/Button";

export default function Contact() {
    const address = "Friedrich-Weick-Strasse 39, 76189 Karlsruhe, Deutschland";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <section className="py-16 md:py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-stretch gap-8 md:gap-12 lg:gap-16">
                    {/* Text section */}
                    <div className="flex-1 w-full lg:w-auto flex flex-col justify-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
                            Besuch uns!
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 mb-8 md:mb-10 lg:mb-12">
                            Im Normalfall kommen wir zu dir oder zu deinem Verein.
                            Wir freuen uns aber natürlich auch, wenn du einfach mal auf eine Tasse Kaffee oder ein Kaltgetränk vorbeischaust! 😀
                        </p>
                        
                        {/* Contact info */}
                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 lg:mb-12">
                            <Link 
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 p-4 md:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                            >
                                <MapPinned className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                                        Unser Standort
                                    </h3>
                                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1">
                                        {address}
                                    </p>
                                </div>
                            </Link>
                        </div>
                        
                        <Button 
                            text="Jetzt Kontakt aufnehmen" 
                            href="/kontakt" 
                            size="lg"
                            className="w-full md:w-auto"
                        />
                    </div>
                    
                    {/* Map section */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative h-64 md:h-80 lg:h-full min-h-[400px] lg:min-h-[500px] rounded-xl overflow-hidden shadow-2xl">
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}&zoom=15`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Unser Standort"
                                className="absolute inset-0 w-full h-full"
                            />
                            {/* Fallback for when Google Maps doesn't work */}
                            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPinned className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">Karte wird geladen...</p>
                                    <Link 
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        In Google Maps öffnen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}