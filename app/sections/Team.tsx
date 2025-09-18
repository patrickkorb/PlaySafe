"use client";

import { useState, useEffect } from "react";
import TeamCard, {TeamCardProps} from "@/app/components/TeamCard";
import { motion } from "framer-motion";

export default function Team() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const teamMembers: TeamCardProps[] = [
        {
            firstname: "Mike",
            lastname: "Allmendinger",
            image: "/images/mike.jpg"
        },
        {
            firstname: "Yasmin",
            lastname: "Ates",
            image: "/images/yasmin_ates.png"
        },
        {
            firstname: "Ethem",
            lastname: "Gökce",
            image: "/images/ethem_gökce.jpg"
        },
    ]

    // Create multiple copies for seamless infinite scroll
    const duplicatedMembers = [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];

    if (!isMounted) {
        return <div className="w-full h-96 bg-gray-100 animate-pulse"></div>;
    }

    return (
        <motion.section 
            id="team" 
            className={"bg-black py-20"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <motion.div 
                className={"max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white"}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h1 className={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6"}>Ein einzigartiges Team <br/> hinter Ihrem Erfolg</h1>
                <p className={"text-base sm:text-lg md:text-xl lg:text-2xl mb-12 md:mb-16"}>Du bist Teamplayer? Wir sind es auch!</p>
                
                {/* Infinite Scrolling Team Carousel */}
                <div className="w-full overflow-hidden">
                    <div className="flex animate-scroll gap-8">
                        {duplicatedMembers.map((member, index) => (
                            <div key={index} className="flex-shrink-0">
                                <TeamCard {...member} />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.section>
    )
}