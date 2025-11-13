"use client"
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Story {
    id: number;
    userName: string;
    userAge: number;
    story: string;
    rating: number;
    backgroundImage: string;
    sport: string;
}

export default function Stories() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const stories: Story[] = [
        {
            id: 1,
            userName: "Markus B.",
            userAge: 34,
            story: "Schnell, freundlich, klar und kompetent. Besser geht's nicht!",
            rating: 5,
            backgroundImage: "/images/herobg.png",
            sport: "Fußball"
        },
        {
            id: 2,
            userName: "Andreas H.",
            userAge: 28,
            story: "Sehr kompetenter junger Mitarbeiter, der sich außerordentlich Zeit für die Beratungen und Erklärungen nimmt. Man merkt, dass er seinen Beruf mit Leidenschaft ausübt.",
            rating: 5,
            backgroundImage: "/images/herobg.png",
            sport: ""
        },
        {
            id: 3,
            userName: "Christian A.",
            userAge: 31,
            story: "Sehr gute Beratung. Sehr freundlich und hilfsbereit, kann man nur weiterempfehlen.",
            rating: 5,
            backgroundImage: "/images/herobg.png",
            sport: "Handball"
        },
        {
            id: 4,
            userName: "Michaela",
            userAge: 26,
            story: "Super Beratung, alle Fragen sehr gut beantwortet und haben ein super Angebot bekommen. Mike Allmendinger ist ein guter Berater!",
            rating: 5,
            backgroundImage: "/images/herobg.png",
            sport: "Volleyball"
        },
        {
            id: 5,
            userName: "Juditta G.",
            userAge: 42,
            story: "Ich danke Herrn Allmendinger für seine Hilfe bei der Bearbeitung der ausstehenden Rechnungen über die ich bereits Mahnungen erhalten habe.",
            rating: 5,
            backgroundImage: "/images/herobg.png",
            sport: "Fitness"
        },
    ];

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, stories.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <motion.section 
            id="stories"
            className="py-16 md:py-20 lg:py-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
                        Was unsere Kunden sagen
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        Echte Erfahrungen von echten Menschen – <br className="hidden sm:block"/>
                        lesen Sie, wie PlaySafe das Leben unserer Kunden verändert hat.
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Main Carousel */}
                    <div 
                        className="relative h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={stories[currentIndex].backgroundImage}
                                        alt={`${stories[currentIndex].userName} background`}
                                        fill
                                        className="object-cover w-full h-full"
                                        priority
                                        style={{ objectPosition: 'center' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                                    <motion.div 
                                        className="max-w-4xl text-center text-white"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        {/* Quote Icon */}
                                        <Quote className="w-12 h-12 md:w-16 md:h-16 text-white/30 mx-auto mb-6" />
                                        
                                        {/* Story Text */}
                                        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed mb-8 md:mb-12">
                                            &quot;{stories[currentIndex].story}&quot;
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
                                            {[...Array(stories[currentIndex].rating)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className="w-6 h-6 md:w-8 md:h-8 fill-yellow-400 text-yellow-400"
                                                />
                                            ))}
                                        </div>

                                        {/* User Info */}
                                        <div className="text-center">
                                            <h4 className="text-xl md:text-2xl font-bold text-white">
                                                {stories[currentIndex].userName}
                                            </h4>
                                            <p className="text-white/80 text-sm md:text-base">
                                                {stories[currentIndex].userAge} Jahre • {stories[currentIndex].sport}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons - Hidden on mobile */}
                    <button
                        onClick={prevSlide}
                        className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    
                    <button
                        onClick={nextSlide}
                        className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    {/* Dots Navigation */}
                    <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {stories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                            />
                        ))}
                    </div>

                </div>

                {/* Call to Action */}
                <motion.div 
                    className="text-center mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                        Möchten Sie auch Teil unserer Erfolgsgeschichten werden?
                    </p>
                    <a 
                        href="/kontakt"
                        className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Jetzt kostenlos beraten lassen
                    </a>
                </motion.div>
            </div>
        </motion.section>
    )
}