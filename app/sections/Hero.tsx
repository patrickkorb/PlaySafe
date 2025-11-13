"use client";

import Image from "next/image";
import Button from "@/app/components/ui/Button";
import {Star} from "lucide-react"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return <div className="w-full h-[500px] bg-gray-100 animate-pulse"></div>;
    }

    return (
        <motion.section 
            id="hero" 
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {/* Background container with responsive aspect ratio */}
            <div className="relative aspect-[3/4] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-video w-full min-h-[600px] sm:min-h-[600px]">
                {/* Desktop Video */}
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
                    poster="/images/herobg.png"
                >
                    <source src="/videos/hero-video-desktop.mp4" type="video/mp4" />
                    <source src="/videos/hero-video-desktop.webm" type="video/webm" />
                </video>
                
                {/* Mobile Video */}
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 block md:hidden"
                    poster="/images/herobg.png"
                >
                    <source src="/videos/hero-video-mobile.mp4" type="video/mp4" />
                    <source src="/videos/hero-video-mobile.webm" type="video/webm" />
                </video>
                
                {/* Fallback image if videos don't load */}
                <Image 
                    src="/images/herobg.png" 
                    alt="Hero background" 
                    fill 
                    className="object-cover -z-10" 
                    priority
                />
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 md:bg-black/20 z-10"></div>
                
                {/* Content container */}
                <div className="relative z-20 w-full h-full flex items-center justify-center px-4 py-6 sm:px-3 sm:py-6 md:p-6 lg:p-8">
                    <motion.div
                        className="bg-white/95 backdrop-blur-sm p-6 sm:p-4 md:p-8 lg:p-12 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        {/* Headline */}
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-5 md:mb-7 leading-none tracking-tight">
                            <span className="text-primary font-black">Sportverletzung?</span>
                            <br />
                            <span className="text-gray-900">Wir zahlen.</span>
                        </h1>
                        
                        {/* Main description */}
                        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-3 sm:mb-5 md:mb-6 leading-tight font-medium text-gray-700">
                            Schnell. Unkompliziert. Direkt aufs Konto.
                        </p>

                        {/* Extended description - hidden on small mobile */}
                        <p className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed text-gray-600 hidden sm:block">
                            Keine endlosen Formulare. Keine Wartezeiten. Einfach faire Unterstützung, wenn du sie brauchst.
                        </p>
                        
                        {/* CTA Button */}
                        <div className="mb-3 sm:mb-5 md:mb-6 lg:mb-8">
                            <Button
                                text="Kostenloses Erstgespräch vereinbaren"
                                href="/kontakt"
                                size="lg"
                                variant={"secondary"}
                            />
                        </div>
                        
                        {/* Rating and testimonial - simplified on mobile */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3 md:gap-4 text-center sm:text-left">
                            <div className="flex items-center gap-1 mb-1 sm:mb-0">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={14}
                                        color="#F7931E"
                                        fill="#F7931E"
                                        className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                                    />
                                ))}
                            </div>
                            <p className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
                                &ldquo;Beratung auf Augenhöhe&rdquo;
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}