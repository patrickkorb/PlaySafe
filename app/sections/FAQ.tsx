
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqItems: FAQItem[] = [
        {
            question: "Greift der Versicherungsschutz nur bei Verletzungen, die während sportlicher Aktivitäten entstehen?",
            answer: "Nein, unsere PlaySafe-Verträge/Produkte decken alle Risiken in deiner kompletten Freizeit ab. Egal ob beim Sport, im Urlaub oder Zuhause."
        },
        {
            question: "Wie schnell erhalte ich mein Schmerzensgeld?",
            answer: "Im Schadenfall findest du das Schmerzensgeld in der Regel innerhalb von einer Woche auf deinem Konto. Wir legen großen Wert auf eine schnelle und unkomplizierte Abwicklung."
        },
        {
            question: "Bin ich auch im Ausland versichert?",
            answer: "Ja, unser Versicherungsschutz gilt weltweit. Egal ob du in Deutschland oder im Ausland unterwegs bist - du bist rundum geschützt."
        },
        {
            question: "Was kostet PlaySafe?",
            answer: "Die Kosten sind individuell und hängen von verschiedenen Faktoren ab. Kontaktiere uns für ein persönliches Angebot, das genau auf deine Bedürfnisse zugeschnitten ist."
        },
        {
            question: "Welche Unterlagen muss ich zur Auszahlung des Schmerzensgeldes einreichen?",
            answer: "Eine Bescheinigung mit der Diagnose von deinem behandelnden Arzt reicht uns vollkommen aus.",
        },
        {
            question: "Was ist, wenn ich bereits eine Unfallversicherung habe?",
            answer: "Schick uns einfach den Versicherungsschein deiner bestehenden Unfallversicherung zu. Wir prüfen deinen Schutz und bieten Dir eine kombinierte Unfallversicherung inkl./ mit Sportschutz an.\n" +
                "So sparst du Geld und hast beide Absicherungen in einer Police.",
        },
        {
            question: "Wie finanziert sich PlaySafe?",
            answer: "Die SIGNAL IDUNA Versicherung steht als großer und erfolgreicher Partner hinter uns.",
        },
        {
            question: "Zahle ich höhere Beiträge, wenn ich im Handwerk tätig bin?",
            answer: "Nein, jeder Berufstätige zahlt bei uns den gleichen Beitrag. Bist du im öffentlichen Dienst beschäftigt, profitierst du sogar noch von weiteren Ersparnissen.",
        },
        {
            question: "Kann unsere Mannschaft auch über PlaySafe informiert werden?",
            answer: "Sehr gerne, wir halten regelmäßig Vorträge bei Sportvereinen. Meldet euch einfach und wir kommen nach Eurem Training mit Kaltgetränken zu einem 10-minütigen Infogespräch zum Thema Sportschutz vorbei.",
        },

    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.section 
            id="faq" 
            className="py-16 md:py-20 lg:py-28 bg-gray-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12 md:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8">
                        Häufig gestellte Fragen
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
                        Du hast Fragen? Hier findest du die wichtigsten Antworten. Für alles andere sind wir gerne persönlich da.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {faqItems.map((item, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 md:px-8 py-6 md:py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                            >
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 pr-4">
                                    {item.question}
                                </h3>
                                <ChevronDown 
                                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            
                            <div 
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-6 md:px-8 pb-6 md:pb-8">
                                    <div className="border-t border-gray-200 pt-6 md:pt-8">
                                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}