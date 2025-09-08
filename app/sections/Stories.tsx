"use client"
import {CarouselItemProps} from "@/app/components/CarouselItem";
import Carousel from "@/app/components/Carousel";
import { motion } from "framer-motion";

export default function Stories() {

    const carouselItems: CarouselItemProps[] = [
        {
            id: 1,
            backgroundImage: "/images/herobg.png",
            userImage: "/images/placeholder.png",
            userName: "Dave Hell",
            userAge: 54,
            story: "Bester Mann"
        },
        {
            id: 2,
            backgroundImage: "/images/herobg.png",
            userImage: "/images/mike.png",
            userName: "Mike Allmendinger",
            userAge: 26,
            story: "Sportschutz ist das beste was mir je passiert ist"
        },
        {
            id: 3,
            backgroundImage: "/images/herobg.png",
            userImage: "/images/placeholder.png",
            userName: "Joel Müller",
            userAge: 22,
            story: "Ich habe mich bereits 2x an der linken Schulter verletzt & habe beide male innerhalb von wenigen Tagen die 1.000€ Schmerzensgeld auf dem Konto gehabt. Schneller und unkomplizierter Ablauf.\n" +
                "Danke @Sportschutz.de"
        },
        {
            id: 4,
            backgroundImage: "/images/herobg.png",
            userImage: "/images/placeholder.png",
            userName: "Joel Müller",
            userAge: 22,
            story: "Ich habe mich bereits 2x an der linken Schulter verletzt & habe beide male innerhalb von wenigen Tagen die 1.000€ Schmerzensgeld auf dem Konto gehabt. Schneller und unkomplizierter Ablauf.\n" +
                "Danke @Sportschutz.de"
        },


    ]

    return (
        <motion.section 
            id="stories"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className={"bg-gray-100"}>
                <motion.div 
                    className={"max-w-4xl mx-auto mt-16 pt-16 px-4 md:px-6 lg:px-8 text-center"}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"}>Die Erfolgsgeschichten unserer Kunden</h1>
                    <p className={"text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl my-8 md:my-12"}>
                        Aus vielen Stimmen wird Vertrauen gebaut – <br className="hidden sm:block"/>
                        unsere Kundenbewertungen sprechen für sich.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Carousel items={carouselItems}/>
                </motion.div>
            </div>
        </motion.section>
    )
}