"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Instagram, MapPin, X, Home, Users, Award, Settings, Heart, DollarSign, HelpCircle } from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    delay: number;
}

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Track scroll position when menu opens
    useEffect(() => {
        if (isMobileMenuOpen) {
            setScrollY(window.scrollY);
        }
    }, [isMobileMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navItems: NavItem[] = [
        {
            title: "Home",
            href: "#hero",
            icon: Home,
            delay: 0
        },
        {
            title: "Über uns",
            href: "#about",
            icon: Users,
            delay: 50
        },
        {
            title: "Referenzen",
            href: "#stories",
            icon: Award,
            delay: 100
        },
        {
            title: "Unsere Leistungen",
            href: "#services",
            icon: Settings,
            delay: 150
        },
        {
            title: "Das Team",
            href: "#team",
            icon: Heart,
            delay: 200
        },
        {
            title: "Sponsoring",
            href: "#sponsor",
            icon: DollarSign,
            delay: 250
        },
        {
            title: "FAQ",
            href: "#faq",
            icon: HelpCircle,
            delay: 300
        },
    ];

    const handleMenuClose = useCallback(async () => {
        setIsClosing(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsMobileMenuOpen(false);
        setIsClosing(false);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        if (isMobileMenuOpen) {
            handleMenuClose();
        } else {
            setIsMobileMenuOpen(true);
        }
    }, [isMobileMenuOpen, handleMenuClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                handleMenuClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen, handleMenuClose]);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5">
                {/* Mobile Layout */}
                <div className="flex lg:hidden justify-between items-center">
                    {/* Logo + Social Links */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
                        <div className="flex items-center gap-2">
                            <Link href="https://instagram.com/" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <Instagram />
                            </Link>
                            <Link href="https://wa.me/" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <Image src={"/images/whatsapp.svg"} alt={"whatsapp logo"} width={20} height={20} />
                            </Link>
                            <Link href="https://instagram.com/" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                                <MapPin />
                            </Link>
                        </div>
                    </div>
                    
                    {/* Modern Animated Menu Button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="relative p-3 text-gray-600 hover:text-primary transition-all duration-300 hover:bg-gray-100/50 rounded-xl group"
                        aria-label="Toggle navigation menu"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                            <span 
                                className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                                }`}
                            ></span>
                            <span 
                                className={`w-full h-0.5 bg-current transition-all duration-300 ${
                                    isMobileMenuOpen ? 'opacity-0 scale-0' : ''
                                }`}
                            ></span>
                            <span 
                                className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                                }`}
                            ></span>
                        </div>
                        
                        {/* Pulse effect */}
                        <div className="absolute inset-0 rounded-xl bg-primary/10 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex justify-between items-center">
                    {/* Left: Logo + Social Links */}
                    <div className="flex items-center gap-6">
                        <div className={"flex flex-row items-center gap-1"}>
                            <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
                            <p className={"text-xl font-bold"}>PlaySafe</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="https://instagram.com/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <Instagram />
                            </Link>
                            <Link href="https://wa.me/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <Image src={"/images/whatsapp.svg"} alt={"whatsapp logo"} width={22} height={22} />
                            </Link>
                            <Link href="https://instagram.com/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                <MapPin />
                            </Link>
                        </div>
                    </div>
                    
                    {/* Center: Navigation Links */}
                    <div className="flex items-center gap-6 xl:gap-8">
                        {navItems.map((item, index) => (
                            <Link 
                                href={item.href} 
                                key={index} 
                                className="text-base xl:text-lg font-semibold text-gray-800 hover:text-primary transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Right: Spacer for balance */}
                    <div className="w-48"></div>
                </div>

                {/* Full Screen Mobile Menu */}
                {isMounted && isMobileMenuOpen && (
                    <div 
                        className={`lg:hidden fixed z-50 w-full bg-white ${isClosing ? 'animate-out' : 'animate-in'}`}
                        style={{
                            top: `${scrollY}px`,
                            left: 0,
                            right: 0,
                            height: '100vh',
                            minHeight: '100vh'
                        }}
                    >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full animate-pulse"></div>
                            <div className="absolute top-40 right-20 w-20 h-20 bg-primary rounded-full animate-pulse animation-delay-1000"></div>
                            <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary rounded-full animate-pulse animation-delay-2000"></div>
                        </div>

                        <div 
                            className={`relative w-full h-full flex flex-col ${isClosing ? 'animate-slideOutUp' : 'animate-slideInUp'}`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 pb-0 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Image 
                                            src="/images/logo.png"
                                            alt="Logo" 
                                            width={45} 
                                            height={45}
                                            className="rounded-xl shadow-lg"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-wide">PlaySafe</h2>
                                        <p className="text-gray-600 text-xs sm:text-sm">Sportschutz.de</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleMenuClose}
                                    className="relative p-3 text-gray-600 hover:text-primary transition-all duration-300 hover:bg-gray-100 rounded-full group"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                                    <div className="absolute inset-0 bg-gray-100 rounded-full scale-0 group-active:scale-100 transition-transform duration-150"></div>
                                </button>
                            </div>

                            {/* Navigation Links - Centered and Full Height */}
                            <div className="flex-1 flex flex-col justify-center px-8 py-12 pt-4 bg-white">
                                <nav className="max-w-md mx-auto w-full">
                                    <ul className="space-y-2">
                                        {navItems.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <li 
                                                    key={index}
                                                    className={`transform transition-all duration-500 ${
                                                        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                                                    }`}
                                                    style={{
                                                        transitionDelay: `${item.delay}ms`
                                                    }}
                                                >
                                                    <Link 
                                                        href={item.href}
                                                        onClick={handleMenuClose}
                                                        className="group flex items-center justify-center gap-4 p-5 text-gray-800 hover:text-primary transition-all duration-300 hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg hover:scale-105 active:scale-95"
                                                    >
                                                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                                                            <Icon className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <span className="text-lg sm:text-xl font-medium tracking-wide flex-1 text-center">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                {/* Social Links Section */}
                                <div
                                    className={`mt-16 pt-8 border-t border-gray-200 transform transition-all duration-700 max-w-md mx-auto w-full ${
                                        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                                    }`}
                                    style={{ transitionDelay: '400ms' }}
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}