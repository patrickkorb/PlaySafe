"use client"
import Link from "next/link";
import { MapPinned } from "lucide-react";
import Button from "@/app/components/ui/Button";

export default function Contact() {
    const address = "Friedrichsplatz 6, 76133 Karlsruhe, Deutschland";
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
                            Normalerweise kommen wir direkt zu dir oder zu deinem Verein.
                            Aber du bist auch jederzeit herzlich willkommen, einfach auf eine Tasse Kaffee oder ein Kaltgetränk bei uns vorbeizuschauen!
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
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2617.114694811474!2d8.398982312485128!3d49.00840289001779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479706458f4d092b%3A0xfd82c06bcc285158!2sFriedrichspl.%206%2C%2076133%20Karlsruhe!5e0!3m2!1sde!2sde!4v1758179699018!5m2!1sde!2sde"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Unser Standort"
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
