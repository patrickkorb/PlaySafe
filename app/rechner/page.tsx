'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link";
import {Check} from "lucide-react";
import PricingCard from "@/app/components/PricingCard";
import Button from "@/app/components/ui/Button";
import { trackLead } from "@/app/components/MetaPixel";
import { trackEnterBirthDate, trackSportSelected, trackFrequencySelected, trackCalculatorComplete } from "@/app/components/Datafast";

export default function Rechner() {
    const [step, setStep] = useState(1)
    const [birthDate, setBirthDate] = useState('')
    const [birthDateError, setBirthDateError] = useState('')
    const [sport, setSport] = useState('')
    const [frequency, setFrequency] = useState('')
    const [isCalculating, setIsCalculating] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const sports = [
        { name: 'Fußball', icon: '⚽', catch: "schon bei Kreuzbandrissen, Bänderrissen und weiteren Fußballverletzungen" },
        { name: 'Tennis', icon: '🎾', catch: "schon bei Sehnenrissen, Bänderrissen und sonstigen Tennisverletzungen"},
        { name: 'Ski', icon: '⛷️', catch: "schon bei Kreuzbandrissen, Knochenbrüchen und sonstigen Skiunfällen"},
        { name: 'Fitness', icon: '💪', catch: "schon bei Muskelrissen, Kapselrissen und sonstigen Trainingsverletzungen" },
        { name: 'Radfahren', icon: '🚴', catch: "schon bei Sehnenrissen, Schlüsselbeinbrüchen und sonstigen Radunfällen" },
        { name: 'Sonstiges', icon: '🏃', catch: "schon bei Rissen oder Brüchen jeder Art" },
    ]

    const frequencies = [
        '1x pro Woche',
        '2-3x pro Woche',
        '4-5x pro Woche',
        'Täglich',
        'Unregelmäßig'
    ]





    const handleBirthDateSubmit = () => {
        setBirthDateError('')

        // Prüfe ob Datum eingegeben wurde
        if (!birthDate) {
            setBirthDateError('Bitte gib dein Geburtsdatum ein')
            return
        }

        // Erstelle Datum-Objekte zum Vergleichen
        const selectedDate = new Date(birthDate)
        const cutoffDate = new Date(1958, 0, 1) // 1. Januar 1958

        // Prüfe ob Person vor 1.1.1958 geboren wurde
        if (selectedDate < cutoffDate) {
            setBirthDateError('Leider können wir für Personen, die vor dem 1.1.1958 geboren wurden, kein Angebot erstellen.')
            return
        }

        // Track Datafast goal: enter_birth_date
        trackEnterBirthDate(birthDate)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(2)
    }

    const handleSportSelect = (sportName: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSport(sportName)

        // Track Datafast goal: select_sport
        trackSportSelected(sportName)

        setStep(3)
    }

    const handleFrequencySelect = (freq: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setFrequency(freq)

        // Track Datafast goal: select_frequency
        trackFrequencySelected(freq)

        setIsCalculating(true)

        // Fake loading animation - 2 Sekunden
        setTimeout(() => {
            setIsCalculating(false)
            setStep(4)
        }, 2000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // Formatiere Datum von YYYY-MM-DD zu DD.MM.YYYY
            const formattedDate = birthDate.split('-').reverse().join('.')

            // Bestimme Tarif basierend auf Häufigkeit
            let tariffName = 'Small'
            let tariffPrice = '10'

            if (frequency === '2-3x pro Woche') {
                tariffName = 'Medium'
                tariffPrice = '15'
            } else if (frequency === '4-5x pro Woche' || frequency === 'Täglich') {
                tariffName = 'Large'
                tariffPrice = '20'
            }

            const message = `
Neue Anfrage über den Rechner:

Persönliche Daten:
- Name: ${name}
- E-Mail: ${email}
- Telefon: ${phone}

Versicherungsdetails:
- Geburtsdatum: ${formattedDate}
- Sportart: ${sport}
- Häufigkeit: ${frequency}

Empfohlener Tarif: ${tariffName} - ${tariffPrice}€/Monat
            `.trim()

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    message
                }),
            })

            if (!response.ok) {
                throw new Error('Fehler beim Senden')
            }

            // Track Lead Event mit User-Daten (Pixel + Conversion API)
            const leadValue = parseInt(tariffPrice) || 10
            await trackLead(
                {
                    email: email,
                    phone: phone,
                    firstName: name.split(' ')[0],  // Erster Teil = Vorname
                    lastName: name.split(' ').slice(1).join(' '),  // Rest = Nachname
                },
                leadValue
            )

            // Track Datafast goal: calculator_complete
            trackCalculatorComplete(sport, frequency, tariffName)

            setSubmitStatus('success')
            // Formular zurücksetzen nach 2 Sekunden
            setTimeout(() => {
                setName('')
                setEmail('')
                setPhone('')
            }, 2000)

        } catch (error) {
            console.error('Error submitting form:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 pt-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Finde deinen perfekten Tarif
                        </h1>
                        <p className="text-xl text-gray-600">
                            In nur 3 Schritten zu deiner Sportversicherung
                        </p>
                    </motion.div>
                )}

                {/* Fortschrittsanzeige */}
                {step < 4 && !isCalculating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`flex justify-center mb-12 ${step >= 2 ? 'pt-8' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{
                                    scale: step >= 1 ? [1, 1.1, 1] : 1,
                                    backgroundColor: step >= 1 ? '#1a3691' : '#d1d5db'
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'text-white' : 'text-gray-600'}`}
                            >
                                1
                            </motion.div>
                            <motion.div
                                animate={{ backgroundColor: step >= 2 ? '#1a3691' : '#d1d5db' }}
                                transition={{ duration: 0.3 }}
                                className="w-16 h-1 rounded"
                            ></motion.div>
                            <motion.div
                                animate={{
                                    scale: step >= 2 ? [1, 1.1, 1] : 1,
                                    backgroundColor: step >= 2 ? '#1a3691' : '#d1d5db'
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'text-white' : 'text-gray-600'}`}
                            >
                                2
                            </motion.div>
                            <motion.div
                                animate={{ backgroundColor: step >= 3 ? '#1a3691' : '#d1d5db' }}
                                transition={{ duration: 0.3 }}
                                className="w-16 h-1 rounded"
                            ></motion.div>
                            <motion.div
                                animate={{
                                    scale: step >= 3 ? [1, 1.1, 1] : 1,
                                    backgroundColor: step >= 3 ? '#1a3691' : '#d1d5db'
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'text-white' : 'text-gray-600'}`}
                            >
                                3
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Schritt 1: Geburtsdatum */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-[#1a3691]"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Wann bist du geboren?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Gib dein Geburtsdatum ein
                        </p>
                        <div className={"flex flex-col items-center gap-4"}>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full max-w-md mx-auto px-6 py-4 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-[#1a3691] focus:outline-none transition-colors"
                                max={new Date().toISOString().split('T')[0]}
                            />

                            {birthDateError && (
                                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 w-full max-w-md mx-auto">
                                    <p className="text-red-700 font-semibold text-center">{birthDateError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleBirthDateSubmit}
                                disabled={!birthDate}
                                className="bg-[#1a3691] hover:bg-[#152a75] hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-16 rounded-lg text-xl transition-colors duration-200 w-full max-w-md"
                            >
                                Weiter
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Schritt 2: Sportart */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl p-12 border-t-4 border-[#1a3691]"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                            Welchen Sport übst du aus?
                        </h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Wähle deine Sportart
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {sports.map((s) => (
                                <button
                                    key={s.name}
                                    onClick={() => handleSportSelect(s.name)}
                                    className="bg-white border-2 border-gray-300 hover:cursor-pointer hover:border-[#1a3691] hover:shadow-lg hover:from-blue-100 hover:to-blue-50 rounded-xl p-6 transition-all duration-200 flex flex-col items-center gap-3"
                                >
                                    <div className="text-6xl">{s.icon}</div>
                                    <div className="text-base md:text-lg font-semibold text-gray-900 whitespace-nowrap">{s.name}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Schritt 3: Häufigkeit */}
                {step === 3 && !isCalculating && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl p-12 border-t-4 border-[#1a3691]"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                            Wie oft übst du {sport} aus?
                        </h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Wähle deine Häufigkeit
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {frequencies.map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => handleFrequencySelect(freq)}
                                    className="bg-white border-2 border-gray-300 hover:cursor-pointer hover:border-[#1a3691] hover:shadow-lg hover:from-blue-100 hover:to-blue-50 rounded-xl p-6 transition-all duration-200 text-xl font-semibold text-gray-900 hover:text-[#1a3691]"
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Loading Animation - Fullscreen */}
                {isCalculating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center min-h-[70vh]"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-2xl p-16 text-center border-t-4 border-[#1a3691] max-w-2xl w-full"
                        >
                            <div className="flex flex-col items-center gap-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-20 h-20 border-4 border-[#1a3691] border-t-transparent rounded-full"
                                />
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Berechne deinen perfekten Tarif...
                                </h2>
                                <div className="space-y-4 text-lg text-gray-600 w-full max-w-md">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-3 bg-green-50 p-4 rounded-lg"
                                    >
                                        <span className="text-2xl text-green-600">✓</span>
                                        <p className="text-left">Analysiere dein Sportprofil</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center gap-3 bg-green-50 p-4 rounded-lg"
                                    >
                                        <span className="text-2xl text-green-600">✓</span>
                                        <p className="text-left">Vergleiche Versicherungspakete</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.3 }}
                                        className="flex items-center gap-3 bg-green-50 p-4 rounded-lg"
                                    >
                                        <span className="text-2xl text-green-600">✓</span>
                                        <p className="text-left">Erstelle dein individuelles Angebot</p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Schritt 4: Ergebnis und Formular */}
                {step === 4 && !isCalculating && (() => {
                    const selectedSport = sports.find(s => s.name === sport)

                    // Bestimme Tarif basierend auf Häufigkeit
                    const getTariff = () => {
                        switch(frequency) {
                            case '1x pro Woche':
                            case 'Unregelmäßig':
                                return {
                                    title: 'Small',
                                    price: '10€',
                                    features: [
                                        "1.000€ sofort aufs Konto",
                                        "Vollinvalidität: 500.000€",
                                        "Krankenhaustagegeld: 10€",
                                        "Schwerverletzung: 2.500€",
                                        "Happy Holiday",
                                        "Zahnersatz: 5.000€",
                                        "Premium Leistungen der SIGNAL IDUNA"
                                    ]
                                }
                            case '2-3x pro Woche':
                                return {
                                    title: 'Medium',
                                    price: '15€',
                                    features: [
                                        "1.500€ sofort aufs Konto",
                                        "Vollinvalidität: 750.000€",
                                        "Krankenhaustagegeld: 30€",
                                        "Schwerverletzung: 7.000€",
                                        "Happy Holiday",
                                        "Zahnersatz: 5.000€",
                                        "Premium Leistungen der SIGNAL IDUNA"
                                    ]
                                }
                            case '4-5x pro Woche':
                            case 'Täglich':
                                return {
                                    title: 'Large',
                                    price: '20€',
                                    features: [
                                        "2.000€ sofort aufs Konto",
                                        "Vollinvalidität: 1.000.000€",
                                        "Krankenhaustagegeld: 50€",
                                        "Schwerverletzung: 12.000€",
                                        "Happy Holiday",
                                        "Zahnersatz: 5.000€",
                                        "Premium Leistungen der SIGNAL IDUNA"
                                    ]
                                }
                            default:
                                return {
                                    title: 'Small',
                                    price: '10€',
                                    features: [
                                        "1.000€ sofort aus Konto",
                                        "Vollinvalidität: 500.000€",
                                        "Krankenhaustagegeld: 10€",
                                        "Schwerverletzung: 2.500€",
                                        "Happy Holiday",
                                        "Zahnersatz: 5.000€",
                                        "Premium Leistungen der SIGNAL IDUNA"
                                    ]
                                }
                        }
                    }

                    const tariff = getTariff()

                    return (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="rounded-2xl py-4 mb-2 text-center">
                            <h2 className="text-3xl font-bold text-black mb-2 flex flex-row items-center justify-center gap-4">
                                Eine Versicherung lohnt sich für dich!
                            </h2>
                            <motion.div
                                className="flex flex-col mx-auto mt-4"
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >

                                {/* Pricing Card */}
                                <div className="flex-1">
                                    <PricingCard
                                        title={tariff.title}
                                        price={tariff.price}
                                        priceSubtext={"/Monat"}
                                        features={tariff.features}
                                        catchPhrase={selectedSport?.catch}
                                        isPopular={false}
                                        buttonText="Jetzt beraten lassen"
                                        buttonHref="/kontakt"
                                        buttonVariant={"v3"}
                                        showButton={false}
                                    />
                                </div>
                            </motion.div>

                        </div>

                        {/* Formular */}
                        <div className="bg-white rounded-2xl shadow-xl py-6 px-2 lg:px-4 max-w-5xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                Auf welcher Nummer erreichen wir dich?
                            </h3>


                            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full pl-16 pr-4 py-4 border-2 border-primary rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
                                            placeholder="Vor- & Nachname"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-2xl">📧</span>
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-16 pr-4 py-4 border-2 border-primary rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
                                            placeholder="Deine Email"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            className="w-full pl-16 pr-4 py-4 border-2 border-primary rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
                                            placeholder="Nummer für das Angebot"
                                        />
                                    </div>
                                    <h4 className={"text-center text-gray-700 text-sm font-semibold"}>
                                        Bitte bedenke, dass wir dir nur ein Angebot erstellen können, wenn deine Rufnummer korrekt angegeben wurde.
                                    </h4>

                                    {submitStatus === 'success' && (
                                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                                            <p className="text-green-700 font-semibold">✓ Anfrage erfolgreich gesendet!</p>
                                            <p className="text-green-600 text-sm mt-1">Wir melden uns in Kürze bei dir.</p>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-center">
                                            <p className="text-red-700 font-semibold">✗ Fehler beim Senden</p>
                                            <p className="text-red-600 text-sm mt-1">Bitte versuche es erneut.</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer disabled:bg-secondary/80 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-lg text-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
                                    >
                                        {isSubmitting ? 'Wird gesendet...' : 'Jetzt Beratungstermin vereinbaren'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Trust Badge & CTA */}
                        <div className="text-center mt-8">
                            <div className={"flex flex-col lg:flex-row gap-2 mt-8 mb-4"}>
                                <p className={"text-4xl font-extrabold bg-primary text-white p-2"}>
                                    5000+ Kunden
                                </p>
                                <p className="text-4xl font-bold text-gray-900 p-2">
                                    vertrauen auf uns!
                                </p>
                            </div>
                            <Link
                                href="/#stories"
                                className="inline-block bg-white hover:bg-gray-50 text-primary font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary"
                            >
                                Überzeug dich selbst →
                            </Link>
                        </div>
                    </motion.div>
                    )
                })()}
            </div>
        </div>
    )
}