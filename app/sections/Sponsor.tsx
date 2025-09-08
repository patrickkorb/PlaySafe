"use client"
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import { motion } from "framer-motion";

export default function Sponsor() {
    return (
        <motion.section 
            id="sponsor" 
            className="py-16 md:py-20 lg:py-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <motion.div 
                    className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Image section */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                            <Image 
                                src="/images/sponsor.png"
                                alt="Sponsoring - Wir auf deinem Trikot" 
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    
                    {/* Text section */}
                    <div className="flex-1 w-full lg:w-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
                            Wir auf deinem Trikot
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 mb-8 md:mb-10 lg:mb-12">
                            Wir sponsorn nicht nur deine Gesundheit, sondern auch deinen Verein.
                            Ganz egal ob beim Fußball, Handball oder anderen Sportarten.
                            Wenn du im Geschehen bist, sind wir dabei!
                            Sprich uns einfach an und wir klären alles weitere!
                        </p>
                        <Button 
                            text="Jetzt Sponsoring anfragen" 
                            href="/kontakt" 
                            size="lg"
                            className="w-full md:w-auto"
                        />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}