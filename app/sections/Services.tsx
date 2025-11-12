"use client"
import { motion } from "framer-motion";
import { Heart, Shield, Hospital, AlertTriangle, Plane } from "lucide-react";

export default function Services() {
    return (
        <motion.section 
            id="services" 
            className={"py-16 md:py-20 lg:py-28"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className={"max-w-7xl mx-auto px-4 md:px-6 lg:px-8"}>
                <motion.div 
                    className={"text-center mb-16 md:mb-20"}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8"}>Unsere Leistungen für dich</h1>
                    <p className={"text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto"}>Unkomplizierte und schnelle Hilfe bei Freizeitverletzungen - Dein umfassender Schutz im Überblick</p>
                </motion.div>

                {/* Services Grid */}
                <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"}>
                    
                    {/* Schmerzensgeld */}
                    <motion.div 
                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Schmerzensgeld</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Nach einem Knochenbruch (vollständige Zusammenhangstrennung) sowie nach einem vollständigen Muskel-, Sehnen-, Bänder- oder Kapselriss erhältst du ein <span className="font-semibold text-primary">Schmerzensgeld von bis zu 2.000€</span>.
                        </p>
                    </motion.div>

                    {/* Invaliditätsleistung */}
                    <motion.div 
                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Invaliditätsleistung</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Bei einer dauerhaften unfallbedingten Beeinträchtigung ab 1% zahlen wir dir eine Invaliditätsleistung. 
                            Zudem als Highlight der SIGNAL IDUNA ab 35% ein Unfallrentenkapital und somit eine <span className="font-semibold text-primary">Gesamtleistung von bis zu 1.000.000€</span>.
                        </p>
                    </motion.div>

                    {/* Krankenhaustagegeld */}
                    <motion.div 
                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Hospital className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Krankenhaustagegeld</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Für jeden Tag, an dem du unfallbedingt stationär behandelt wirst, zahlen wir dir ein <span className="font-semibold text-primary">Unfall-Krankenhaustagegeld von bis zu 50€ pro Tag</span>.
                        </p>
                    </motion.div>

                    {/* Schwerverletzung */}
                    <motion.div 
                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <AlertTriangle className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Schwerverletzung</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Bei besonders schweren Unfällen ist schnelle Hilfe erforderlich. 
                            Daher bekommst du von uns als Erste Hilfe Leistung <span className="font-semibold text-primary">bis zu 12.000€</span> bei bspw. Schädel-Hirnverletzungen, Brüchen langer Röhrenknochen an 2 unterschiedlichen Gliedmaßen, Verbrennungen II. oder III. Grades ab 30% der Körperfläche.
                        </p>
                    </motion.div>

                    {/* Happy Holiday */}
                    <motion.div 
                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Plane className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Happy Holiday</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Bei Unfällen, die mehr als 100 km von deinem Wohnort entfernt passieren, wird deine Versicherung um folgende Leistungen erweitert:
                        </p>
                        <ul className="text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>ein <span className="font-semibold text-primary">Schmerzensgeld in Höhe von 1.000€</span></span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>ein einmaliges <span className="font-semibold text-primary">Unfall-Krankenhausgeld von 500€</span> bei einem unfallbedingten vollstationären Aufenthalt von mindestens zwei Tagen</span>
                            </li>
                        </ul>
                    </motion.div>

                </div>
            </div>
        </motion.section>
    )
}