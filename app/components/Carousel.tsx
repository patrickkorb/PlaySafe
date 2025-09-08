"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselItem from "./CarouselItem";

interface CarouselData {
    id: number;
    backgroundImage: string;
    userImage: string;
    userName: string;
    userAge: number;
    story: string;
}

interface CarouselProps {
    items: CarouselData[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export default function Carousel({ 
    items, 
    autoPlay = true, 
    autoPlayInterval = 5000 
}: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === items.length - 1 ? 0 : prevIndex + 1
            );
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, items.length]);

    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!items.length) return null;

    return (
        <div className="relative w-full max-w-4xl mx-auto pb-16">
            {/* Main carousel container */}
            <div className="relative overflow-hidden rounded-2xl">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item) => (
                        <div key={item.id} className="w-full flex-shrink-0">
                            <CarouselItem 
                                id={item.id}
                                backgroundImage={item.backgroundImage}
                                userImage={item.userImage}
                                userName={item.userName}
                                userAge={item.userAge}
                                story={item.story}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation arrows */}
            <button 
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-30"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button 
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-30"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center space-x-2 mt-4">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentIndex 
                                ? 'bg-primary scale-110' 
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}