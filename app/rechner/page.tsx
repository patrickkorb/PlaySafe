'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link";
import {Check} from "lucide-react";
import PricingCard from "@/app/components/PricingCard";
import Button from "@/app/components/ui/Button";
import { trackLead } from "@/app/components/MetaPixel";
import { trackEnterBirthDate, trackSportSelected, trackFrequencySelected, trackCalculatorComplete } from "@/app/components/Datafast";
import { Toaster, toast } from 'sonner';

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

    // Zufällige Namen für Toast-Benachrichtigungen
    const firstNames = ['Markus', 'Thomas', 'Stefan', 'Michael', 'Andreas', 'Christian', 'Daniel', 'Sebastian', 'Alexander', 'Tobias', 'Julia', 'Anna', 'Laura', 'Sarah', 'Lisa', 'Maria', 'Katharina', 'Nina', 'Sophie', 'Jana']
    const lastInitials = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'W.', 'Z.']
    const times = ["vor 2 Minuten","vor 4 Minuten", "vor 5 Minuten", "vor 8 Minuten", "vor 10 Minuten", "vor 15 Minuten", "gerade eben", "gerade eben", "gerade eben"]

    const getRandomName = () => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)]
        return `${firstName} ${lastInitial}`
    }

    const getRandomMinutes = () => {
        return times[Math.floor(Math.random() * times.length)]
    }

    // Toast-Benachrichtigungen nur für Schritt 1
    useEffect(() => {
        if (step === 1) {
            let interval: NodeJS.Timeout | null = null

            // Zeige ersten Toast nach 1,5 Sekunden
            const firstTimeout = setTimeout(() => {
                toast.success(`${getRandomName()} hat ${getRandomMinutes()} ein Angebot erhalten`, {
                    duration: 2500,
                })

                // Starte Interval für weitere Toasts alle 3 Sekunden
                interval = setInterval(() => {
                    toast.success(`${getRandomName()} hat ${getRandomMinutes()} ein Angebot erhalten`, {
                        duration: 3000,
                    })
                }, 3000)
            }, 1500)

            return () => {
                clearTimeout(firstTimeout)
                if (interval) clearInterval(interval)
            }
        }
    }, [step])

    // Formatiert Eingabe zu DD.MM.JJJJ
    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Nur Zahlen

        if (value.length >= 2) {
            value = value.slice(0, 2) + '.' + value.slice(2)
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + '.' + value.slice(5)
        }
        if (value.length > 10) {
            value = value.slice(0, 10)
        }

        setBirthDate(value)
    }



    const handleBirthDateSubmit = () => {
        setBirthDateError('')

        // Prüfe ob Datum eingegeben wurde
        if (!birthDate) {
            setBirthDateError('Bitte gib dein Geburtsdatum ein')
            return
        }

        // Validiere Format DD.MM.JJJJ
        if (birthDate.length !== 10) {
            setBirthDateError('Bitte gib ein vollständiges Datum ein (TT.MM.JJJJ)')
            return
        }

        // Parse DD.MM.JJJJ
        const parts = birthDate.split('.')
        if (parts.length !== 3) {
            setBirthDateError('Ungültiges Datumsformat')
            return
        }

        const day = parseInt(parts[0])
        const month = parseInt(parts[1])
        const year = parseInt(parts[2])

        // Validiere Werte
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
            setBirthDateError('Ungültiges Datum')
            return
        }

        // Erstelle Datum-Objekte zum Vergleichen
        const selectedDate = new Date(year, month - 1, day)
        const cutoffDate = new Date(1958, 0, 1) // 1. Januar 1958

        // Prüfe ob Datum gültig ist (z.B. 31.02 wird zu einem anderen Datum)
        if (selectedDate.getDate() !== day || selectedDate.getMonth() !== month - 1 || selectedDate.getFullYear() !== year) {
            setBirthDateError('Ungültiges Datum')
            return
        }

        // Prüfe ob Person vor 1.1.1958 geboren wurde
        if (selectedDate < cutoffDate) {
            setBirthDateError('Leider können wir für Personen, die vor dem 1.1.1958 geboren wurden, kein Angebot erstellen.')
            return
        }

        // Prüfe ob Datum in der Zukunft liegt
        if (selectedDate > new Date()) {
            setBirthDateError('Das Datum darf nicht in der Zukunft liegen')
            return
        }

        // Track Datafast goal: enter_birth_date
        trackEnterBirthDate(birthDate)

        // Entferne alle aktiven Toasts sofort
        toast.dismiss()

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
            // Datum ist bereits in DD.MM.YYYY Format
            const formattedDate = birthDate

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
        <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 pt-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            In 3 Schritten zu deinem Tarif
                        </h1>
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
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Wann bist du geboren?
                        </h2>
                        <div className={"flex flex-col items-center gap-4"}>
                            <input
                                type="text"
                                value={birthDate}
                                onChange={handleBirthDateChange}
                                className="w-full max-w-md mx-auto px-6 py-4 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-[#1a3691] focus:outline-none transition-colors"
                                placeholder="TT.MM.JJJJ"
                                inputMode="numeric"
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
                        className=""
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Welchen Sport übst du aus?
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        className=""
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Wie oft übst du {sport} aus?
                        </h2>
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
                        className="flex items-center justify-center min-h-[70vh] pt-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
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
                            <h2 className="text-3xl font-bold text-black mb-2 flex flex-row items-center justify-center gap-4 mt-2">
                                Eine Versicherung lohnt sich für dich!
                            </h2>
                            <p className={"text-gray-700 font-semibold my-4"}>Laut deinen Angaben treibst du regelmäßig Sport und solltest dich deshalb definitiv absichern.</p>
                            <p className={"text-gray-700 font-semibold"}>Für einen geringen monatlichen Betrag, bist du für die häufigsten Sportverletzungen vorbereitet:</p>
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
                        <div className=" rounded-2xl py-6 px-2 lg:px-4 max-w-5xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                Wie können wir dich erreichen?
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
                                            placeholder="Deine E-Mail"
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
                                            placeholder="Deine Handynummer"
                                        />
                                    </div>


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
                                        className="w-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer disabled:bg-secondary/80 disabled:cursor-not-allowed text-white font-bold py-4 px-8 leading-7 rounded-lg text-md transition-all duration-300 shadow-lg hover:shadow-xl mt-1"
                                    >
                                        {isSubmitting ? 'Wird gesendet...' : 'Unverbindliches Angebot erhalten'}
                                    </button>
                                </div>
                            </form>
                            <p className={"font-bold text-lg text-gray-800 mt-6 mb-1"}>Wie gehts weiter?</p>
                            <p className={"font-semibold text-gray-700"}>Nachdem du deine Daten gesendet hast, melden wir uns persönlich bei dir und stellen dir dein individuelles, unverbindliches Angebot zusammen. Du erhältst alle Informationen transparent und ohne Verpflichtung.</p>
                            <ul className={"flex flex-col items-start gap-2 mt-4 font-semibold text-gray-700"}>
                                <li>
                                    📅Rückmeldung meist am selben Tag
                                </li>
                                <li>
                                    📞Kein Werbeanruf - nur ehrliche Beratung
                                </li>
                                <li>
                                    🔒Deine Angaben bleiben vertraulich - keine Weitergabe und kein Spam
                                </li>
                            </ul>
                        </div>

                        {/* Google Reviews Badge */}
                        <div className="text-center mb-8">
                            <a
                                href="https://www.google.com/search?sca_esv=56cc1d46b226e482&rlz=1C1UKOV_deDE1165DE1165&sxsrf=AE3TifN4x6Y16HhJrRe6BxVvlU7-D9ImQg:1764339064823&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5xt_wqzbPBtMB-_nYo-edtriR3148wcP90sPj3SZBlswjjI6ZfvtmZAwirrcQpoSozMmTJGKB7VWvet7xmS31R5ntFF9YtI7XHe9a2wFU-6NZCir7IvMU1zrAWegeagomnfR53-x_71Vo3mhhKVE9XbPseFU3JitckJYiNNkmDVt-LSrg%3D%3D&q=SIGNAL+IDUNA+Versicherung+Mike+Allmendinger+-+Versicherungsagentur+Rezensionen&sa=X&ved=2ahUKEwi4luOZg5WRAxX88LsIHfbOGMIQ0bkNegQIIRAE&biw=1920&bih=945&dpr=1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
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
                                    75+ Rezensionen
                                </p>
                            </a>
                        </div>

                        {/* Trust Badge & CTA */}
                        <div className="text-center mt-2 bg-white">
                            <div className={"flex flex-col lg:flex-row gap-2 mb-4"}>
                                <p className={"text-4xl font-extrabold bg-primary text-white p-2"}>
                                    5000+ Kunden
                                </p>
                                <p className="text-4xl font-bold text-gray-900">
                                    vertrauen auf uns!
                                </p>
                            </div>
                            <Link
                                href="/#stories"
                                className="inline-block bg-white hover:bg-gray-50 text-primary font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary mb-8"
                            >
                                Überzeug dich selbst →
                            </Link>
                        </div>
                    </motion.div>
                    )
                })()}
            </div>

            {/* Toast Benachrichtigungen */}
            <Toaster position="bottom-center" />
        </div>
    )
}