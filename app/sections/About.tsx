"use client"
import { Award, TrendingUp, Heart } from "lucide-react";
import Button from "@/app/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
    return (
        <motion.section 
            id="about" 
            className="py-12 md:py-16 lg:py-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Hero section - Play.Safe.Playsafe! + Video */}
                {/*<motion.div */}
                {/*    className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 pb-12 md:pb-16 lg:pb-20 border-b border-primary mb-12 md:mb-16 lg:mb-20"*/}
                {/*    initial={{ opacity: 0, y: 60 }}*/}
                {/*    whileInView={{ opacity: 1, y: 0 }}*/}
                {/*    viewport={{ once: true }}*/}
                {/*    transition={{ duration: 0.8, delay: 0.2 }}*/}
                {/*>*/}
                {/*    <div className="flex-1 w-full lg:w-auto">*/}
                {/*        <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 mb-6 md:mb-8">*/}
                {/*            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-none">Play.</h2>*/}
                {/*            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-none">Safe.</h2>*/}
                {/*            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-none text-primary">PlaySafe!</h2>*/}
                {/*        </div>*/}
                {/*        <div className="space-y-4 md:space-y-6">*/}
                {/*            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700">*/}
                {/*                Hey, wir sind das Team von PlaySafe.fit und haben es uns zur Aufgabe gemacht, Sportlern den bestmöglichen Schutz zu bieten.*/}
                {/*            </p>*/}
                {/*            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700">*/}
                {/*                Seit mehreren Jahren widmen wir uns mit voller Leidenschaft diesem Thema und stehen im engen Austausch mit zahlreichen Sportlern und Vereinen, um ihre Bedürfnisse wirklich zu verstehen und optimal abzusichern.*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="flex-1 w-full lg:w-auto">*/}
                {/*        <video */}
                {/*            className="w-full h-auto rounded-xl shadow-2xl"*/}
                {/*            controls*/}
                {/*            poster="/images/placeholder.png"*/}
                {/*        >*/}
                {/*            <source src="/videos/your-video.mp4" type="video/mp4" />*/}
                {/*            <source src="/videos/your-video.webm" type="video/webm" />*/}
                {/*            Your browser does not support the video tag.*/}
                {/*        </video>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}
                {/*/!* Feature cards - 4 key benefits *!/*/}
                {/*<motion.div */}
                {/*    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10"*/}
                {/*    initial={{ opacity: 0, y: 40 }}*/}
                {/*    whileInView={{ opacity: 1, y: 0 }}*/}
                {/*    viewport={{ once: true }}*/}
                {/*    transition={{ duration: 0.6, delay: 0.4 }}*/}
                {/*>*/}
                {/*    <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gray-50/50">*/}
                {/*        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">*/}
                {/*            Persönliche Kommunikation*/}
                {/*        </h3>*/}
                {/*        <p className="text-sm md:text-base text-gray-600 leading-relaxed">*/}
                {/*            Bei uns hast du einen persönlichen Ansprechpartner statt einer 0800er Nummer eines Call Centers.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gray-50/50">*/}
                {/*        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">*/}
                {/*            Unkomplizierte Hilfe*/}
                {/*        </h3>*/}
                {/*        <p className="text-sm md:text-base text-gray-600 leading-relaxed">*/}
                {/*            Im Schadenfall findest du das &ldquo;Schmerzensgeld&rdquo; in der Regel innerhalb von einer Woche auf deinem Konto!*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gray-50/50">*/}
                {/*        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">*/}
                {/*            Ganzheitlicher Ansatz*/}
                {/*        </h3>*/}
                {/*        <p className="text-sm md:text-base text-gray-600 leading-relaxed">*/}
                {/*            Bei uns greifen alle Bausteine ineinander –für deinen Schutz aus einer Hand, in jeder Lebenslage.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gray-50/50">*/}
                {/*        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">*/}
                {/*            Individuelle Konzepte*/}
                {/*        </h3>*/}
                {/*        <p className="text-sm md:text-base text-gray-600 leading-relaxed">*/}
                {/*            So wie jeder Mensch anders ist, sind natürlich auch unsere Pakete auf dich maßgeschneidert.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}
                {/* Mike section - Personal introduction with image */}
                <motion.div
                    className={"text-center mb-16 md:mb-20"}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8"}>Der Mann hinter PlaySafe</h1>
                    <p className={"text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto"}>Zertifizierte und ehrliche Hilfe</p>
                </motion.div>
                <motion.div
                    className="bg-gradient-to-br from-primary/10 via-primary/5 to-gray-50 mt-16 md:mt-20 lg:mt-24 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-primary/20"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 p-6 md:p-8 lg:p-12 xl:p-16">
                            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-6 md:mb-8">
                                Ich bin Mike Allmendinger. <br className="hidden md:block"/>
                                <span className="text-primary">An deiner Seite, in jedem Spiel.</span>
                            </h2>
                            <p className="text-black/80 text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 lg:mb-12">
                                Als dein persönlicher Ansprechpartner stehe ich dir mit Fachwissen und Leidenschaft zur Seite.
                                PlaySafe ist mehr als eine Versicherung – es ist ein maßgeschneidertes Schutzkonzept, das genau auf deine sportlichen Anforderungen zugeschnitten ist.
                            </p>

                            {/* Credentials list */}
                            <ul className="space-y-4 md:space-y-6 mb-8 md:mb-10 lg:mb-12">
                                <li className="flex items-start gap-4">
                                    <Award className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0 mt-1" />
                                    <span className=" text-base md:text-lg lg:text-xl font-semibold">Zertifizierter Experte für Absicherung</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0 mt-1" />
                                    <span className="text-base md:text-lg lg:text-xl font-semibold break-words">Hunderte echte Erfolgsgeschichten</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Heart className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0 mt-1" />
                                    <span className=" text-base md:text-lg lg:text-xl font-semibold">100% zufriedene Kunden</span>
                                </li>
                            </ul>
                            
                            {/* CTA Button */}
                            <Button 
                                text="Jetzt Kontakt aufnehmen" 
                                href="/kontakt" 
                                size="lg"
                                className="w-full md:w-auto"
                            />
                        </div>
                        
                        {/* Image section */}
                        {/*<div className="flex-1 lg:max-w-lg xl:max-w-xl">*/}
                        {/*    <div className="relative h-64 md:h-80 lg:h-full min-h-[400px] md:min-h-[600px]">*/}
                        {/*        <Image */}
                        {/*            src="/images/mike.jpg"*/}
                        {/*            alt="Mike Allmendinger - Dein persönlicher Berater" */}
                        {/*            fill*/}
                        {/*            className="object-cover lg:rounded-r-2xl xl:rounded-r-3xl"*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}