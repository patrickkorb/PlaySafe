"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import Image from "next/image";

interface FormData {
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    interessen: string[];
    bemerkungen: string;
}

export default function Kontakt() {
    const [formData, setFormData] = useState<FormData>({
        vorname: "",
        nachname: "",
        email: "",
        telefon: "",
        interessen: [],
        bemerkungen: ""
    });

    const interessenOptionen = [
        "Unsere Pakete",
        "Sponsoring",
        "Leistungen",
        "Signal Iduna",
        "Sonstiges"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckboxChange = (interesse: string) => {
        setFormData(prev => ({
            ...prev,
            interessen: prev.interessen.includes(interesse)
                ? prev.interessen.filter(item => item !== interesse)
                : [...prev.interessen, interesse]
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${formData.vorname} ${formData.nachname}`.trim(),
                    email: formData.email,
                    phone: formData.telefon,
                    message: formData.interessen.length > 0 || formData.bemerkungen 
                        ? `${formData.interessen.length > 0 ? `Interessen: ${formData.interessen.join(', ')}\n\n` : ''}${formData.bemerkungen || 'Keine weiteren Bemerkungen'}`
                        : 'Kontaktanfrage ohne spezifische Nachricht'
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    vorname: "",
                    nachname: "",
                    email: "",
                    telefon: "",
                    interessen: [],
                    bemerkungen: ""
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Fehler beim Senden:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Header */}
                <motion.div 
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                </motion.div>

                {/* Contact Form and Founder Info */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Contact Form */}
                    <motion.div 
                        className="lg:col-span-3 bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 lg:p-10"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                    <form onSubmit={handleSubmit} data-leadstream-form={true} className="space-y-5 sm:space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="vorname" className="block text-sm font-semibold text-white mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Vorname *
                                </label>
                                <input
                                    type="text"
                                    id="vorname"
                                    name="vorname"
                                    value={formData.vorname}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                                    placeholder="Dein Vorname"
                                    data-leadstream={"vorname"}
                                />
                            </div>
                            <div>
                                <label htmlFor="nachname" className="block text-sm font-semibold text-white mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Nachname *
                                </label>
                                <input
                                    type="text"
                                    id="nachname"
                                    name="nachname"
                                    value={formData.nachname}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                                    placeholder="Dein Nachname"
                                    data-leadstream={"nachname"}
                                />
                            </div>
                        </div>

                        {/* Contact Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    E-Mail *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                                    placeholder="deine.email@beispiel.de"
                                    data-leadstream={"email"}
                                />
                            </div>
                            <div>
                                <label htmlFor="telefon" className="block text-sm font-semibold text-white mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Telefonnummer
                                </label>
                                <input
                                    type="tel"
                                    id="telefon"
                                    name="telefon"
                                    value={formData.telefon}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                                    placeholder="0123 456789"
                                    data-leadstream={"telefon"}
                                />
                            </div>
                        </div>

                        {/* Interests Checkboxes */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-4">
                                Wofür interessierst du dich? (Mehrfachauswahl möglich)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {interessenOptionen.map((interesse, index) => (
                                    <label key={index} className="flex items-center p-3 sm:p-4 border border-gray-600 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-all duration-300 hover:border-gray-500 group">
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={formData.interessen.includes(interesse)}
                                                onChange={() => handleCheckboxChange(interesse)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                                                formData.interessen.includes(interesse) 
                                                    ? 'bg-primary border-primary' 
                                                    : 'border-gray-500 bg-gray-700 group-hover:border-gray-400'
                                            }`}>
                                                {formData.interessen.includes(interesse) && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm sm:text-base text-white ml-3 group-hover:text-gray-100 transition-colors">{interesse}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Comments Field */}
                        <div>
                            <label htmlFor="bemerkungen" className="block text-sm font-semibold text-white mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Bemerkungen
                            </label>
                            <textarea
                                id="bemerkungen"
                                name="bemerkungen"
                                value={formData.bemerkungen}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-vertical text-sm sm:text-base placeholder-gray-400"
                                placeholder="Hier kannst du uns weitere Informationen mitteilen oder spezielle Fragen stellen..."
                            />
                        </div>

                        {/* Status Messages */}
                        {submitStatus === 'success' && (
                            <div className="p-4 bg-green-800 border border-green-600 rounded-lg">
                                <p className="text-green-100 text-sm">
                                    ✅ Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns bald bei Ihnen.
                                </p>
                            </div>
                        )}
                        
                        {submitStatus === 'error' && (
                            <div className="p-4 bg-red-800 border border-red-600 rounded-lg">
                                <p className="text-red-100 text-sm">
                                    ❌ Entschuldigung, beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2 sm:pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                                    isSubmitting 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-primary text-white hover:cursor-pointer hover:bg-primary/90 hover:scale-105 active:scale-95'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Wird gesendet...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Nachricht senden
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    </motion.div>

                    {/* Founder Info - Right Side */}
                    <motion.div 
                        className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* Mike's Photo */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                            <Image 
                                src="/images/mike.jpg"
                                alt="Mike Allmendinger" 
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                Mike Allmendinger
                            </h3>
                            <p className="text-sm text-primary font-semibold mb-3">
                                Dein persönlicher Berater
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                Direkter Kontakt statt anonymer Hotline. Ich nehme mir Zeit für deine Fragen und berate dich ehrlich und kompetent.
                            </p>
                            <div className="space-y-2">
                                <a href="tel:072179180110" className="flex justify-center gap-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                                    <Phone size={20}/>
                                    <span>0162 9436375</span>
                                </a>
                                <a href="mailto:mike.allmendinger@signal-iduna.net" className="flex justify-center gap-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                                    <Mail size={20}/>
                                    <span>mike.allmendinger@signal-iduna.net</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}