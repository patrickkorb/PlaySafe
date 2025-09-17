import Link from "next/link";
import Image from "next/image";
import { MapPinned, Phone, Mail } from "lucide-react";

export default function Footer() {
    const companyLinks = [
        { title: "Home", href: "/" },
        { title: "Über uns", href: "/" },
        { title: "Referenzen", href: "/" },
        { title: "Unsere Leistungen", href: "/" },
        { title: "Das Team", href: "/" },
        { title: "Sponsoring", href: "/" },
        { title: "FAQ", href: "/" },
    ];

    const legalLinks = [
        { title: "Impressum", href: "/impressum" },
        { title: "Datenschutz", href: "/datenschutz" },
    ];

    return (
        <footer className="bg-black text-white pb-8 pt-16 md:pt-20 lg:pt-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
                    {/* Logo Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <Image 
                                src="/images/logo.png" 
                                alt="PlaySafe Logo" 
                                width={50} 
                                height={50}
                                className="rounded-lg"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-primary">PlaySafe</h3>
                                <p className="text-sm text-gray-400">PlaySafe.de</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Dein zuverlässiger Partner für Sportversicherungen und umfassenden Schutz in der Freizeit.
                        </p>
                    </div>

                    {/* Unternehmen Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 md:mb-6">Unternehmen</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rechtliches Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 md:mb-6">Rechtliches</h4>
                        <ul className="space-y-3">
                            {legalLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kontakt Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 md:mb-6">Kontakt</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-300">+49 123 456 789</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-300">info@playsafe.de</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPinned className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-300 leading-relaxed">
                                        Friedrichsplatz 6<br />
                                        76133 Karlsruhe<br />
                                        Deutschland
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-8 md:pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            {new Date().getFullYear()} PlaySafe - PlaySafe.de. Alle Rechte vorbehalten.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link 
                                href="https://instagram.com/" 
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Instagram
                            </Link>
                            <Link 
                                href="https://api.whatsapp.com/send/?phone=4972179180110&text=Hallo+Mike%2C+ich+habe+Interesse+an+PlaySafe.+Lass+uns+bitte+einen+Termin+vereinbaren.+Viele+Gr%C3%BC%C3%9Fe&type=phone_number&app_absent=0"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                WhatsApp
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}