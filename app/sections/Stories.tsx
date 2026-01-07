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

                {/* Google Reviews Badge */}
                <motion.div
                    className="text-center mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <a
                        href="https://www.google.com/search?sca_esv=56cc1d46b226e482&rlz=1C1UKOV_deDE1165DE1165&sxsrf=AE3TifN4x6Y16HhJrRe6BxVvlU7-D9ImQg:1764339064823&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5xt_wqzbPBtMB-_nYo-edtriR3148wcP90sPj3SZBlswjjI6ZfvtmZAwirrcQpoSozMmTJGKB7VWvet7xmS31R5ntFF9YtI7XHe9a2wFU-6NZCir7IvMU1zrAWegeagomnfR53-x_71Vo3mhhKVE9XbPseFU3JitckJYiNNkmDVt-LSrg%3D%3D&q=SIGNAL+IDUNA+Versicherung+Mike+Allmendinger+-+Versicherungsagentur+Rezensionen&sa=X&ved=2ahUKEwi4luOZg5WRAxX88LsIHfbOGMIQ0bkNegQIIRAE&biw=1920&bih=945&dpr=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-[500px] mx-auto flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    >
                        {/* Google Logo */}
                        <svg width="80" height="26" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                            <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                            <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                            <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                        </svg>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-gray-900">5,0</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-6 h-6 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Review Count */}
                        <p className="text-gray-600 font-semibold text-sm">
                            80+ Rezensionen
                        </p>
                    </a>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                        Möchten Sie auch Teil unserer Erfolgsgeschichten werden?
                    </p>
                    <a
                        href="/angebot"
                        className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Jetzt Angebot anfordern
                    </a>
                </motion.div>
            </div>
        </motion.section>
    )
}