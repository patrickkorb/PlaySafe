"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Instagram, MapPin, Menu, X } from "lucide-react";

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { title: "Home", href: "/#hero" },
        { title: "Über uns", href: "/#about" },
        { title: "Referenzen", href: "/#stories" },
        { title: "Unsere Leistungen", href: "/#services" },
        { title: "Sponsoring", href: "/#sponsor" },
        { title: "FAQ", href: "/#faq" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="px-4 md:px-6 lg:px-8 py-4">
                {/* Mobile Layout */}
                <div className="flex lg:hidden justify-between items-center">
                    {/* Logo + Social Links */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
                        <Image src="/images/partner2.svg" alt="signal iduna partner logo" width={140} height={140} className={"-ml-2"}/>
                        <div className="flex items-center gap-2">
                            <Link href="https://instagram.com/playsafe.fit" target={"_blank"} className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <Instagram color={"black"}/>
                            </Link>
                            <Link href="https://wa.me/491629436375?text=Hallo%20Mike%2C%20ich%20habe%20Interesse%20an%20PlaySafe.%20Lass%20uns%20bitte%20einen%20Termin%20vereinbaren.%20Viele%20Gr%C3%BC%C3%9Fe" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <Image src={"/images/whatsapp.svg"} alt={"whatsapp logo"} width={22} height={22} />
                            </Link>
                            <Link href="https://maps.app.goo.gl/Ge64CUzvMQ8vQXvh7" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <MapPin color={"black"}/>
                            </Link>
                        </div>
                    </div>

                    {/* Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex justify-between items-center">
                    {/* Left: Logo + Social Links */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="flex flex-row items-center gap-1">
                            <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
                            <Image src="/images/partner2.svg" alt="signal iduna partner logo" width={140} height={140} className={"-ml-2 mt-0"}/>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="https://instagram.com/playsafe.fit" target={"_blank"} className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <Instagram size={18} color={"black"}/>
                            </Link>
                            <Link href="https://wa.me/491629436375?text=Hallo%20Mike%2C%20ich%20habe%20Interesse%20an%20PlaySafe.%20Lass%20uns%20bitte%20einen%20Termin%20vereinbaren.%20Viele%20Gr%C3%BC%C3%9Fe" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <Image src={"/images/whatsapp.svg"} alt={"whatsapp logo"} width={18} height={18} />
                            </Link>
                            <Link href="https://maps.app.goo.gl/Ge64CUzvMQ8vQXvh7" target="_blank" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <MapPin size={18} color={"black"}/>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Center: Navigation Links */}
                    <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
                        {navItems.map((item, index) => (
                            <Link 
                                href={item.href} 
                                key={index} 
                                className="text-sm lg:text-base font-semibold text-gray-800 hover:text-primary transition-colors whitespace-nowrap"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Right: Contact Button */}
                    <div className="flex justify-end">
                        <Link 
                            href="/kontakt"
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                        >
                            Kontakt
                        </Link>
                    </div>
                </div>

                {/* Simple Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-2 pt-4">
                            {navItems.map((item, index) => (
                                <Link 
                                    key={index}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}