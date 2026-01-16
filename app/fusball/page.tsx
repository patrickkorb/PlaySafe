'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from "next/link"
import PricingCard from "@/app/components/PricingCard"
import { trackLead } from "@/app/components/MetaPixel"
import { trackGenderSelected, trackFrequencySelected, trackInsuranceStatusSelected, trackInjuryStatusSelected, trackCalculatorComplete } from "@/app/components/Datafast"
import { Mars, Venus } from "lucide-react"
import ChoiceCard from "./components/ChoiceCard"

export default function FussballRechner() {
    const [step, setStep] = useState(1)
    const [gender, setGender] = useState('')
    const [frequency, setFrequency] = useState('')
    const [hasInsurance, setHasInsurance] = useState('')
    const [hasInjury, setHasInjury] = useState('')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const genderOptions = [
        { name: 'Männlich', icon: Mars },
        { name: 'Weiblich', icon: Venus },
    ]

    const frequencyOptions = [
        { name: '1x pro Woche', emoji: '📅', image: '/images/fusball/cat.webp' },
        { name: '2-3x pro Woche', emoji: '💪', image: '/images/fusball/soccer1.webp' },
        { name: '4-5x pro Woche', emoji: '🔥', image: '/images/fusball/soccer2.webp' },
        { name: 'Täglich', emoji: '⭐', image: '/images/fusball/soccer3.webp' }
    ]

    const insuranceOptions = [
        { name: 'Ja', emoji: '✅', image: '/images/fusball/thumbsup.webp' },
        { name: 'Nein', emoji: '❌', image: '/images/fusball/injury.webp' }
    ]

    const injuryOptions = [
        { name: 'Ja', emoji: '🤕', image: '/images/fusball/injury.webp' },
        { name: 'Nein', emoji: '✅', image: '/images/fusball/soccer2.webp' }
    ]


    const handleGenderSelect = (selectedGender: string) => {
        setGender(selectedGender)

        // Track Datafast goal: select_gender
        trackGenderSelected(selectedGender)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(2)
    }

    const handleFrequencySelect = (freq: string) => {
        setFrequency(freq)

        // Track Datafast goal: select_frequency
        trackFrequencySelected(freq)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(3)
    }

    const handleInsuranceSelect = (insurance: string) => {
        setHasInsurance(insurance)

        // Track Datafast goal: select_insurance_status
        trackInsuranceStatusSelected(insurance)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(4)
    }

    const handleInjurySelect = (injury: string) => {
        setHasInjury(injury)

        // Track Datafast goal: select_injury_status
        trackInjuryStatusSelected(injury)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(5)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
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
Neue Anfrage über den Fußball-Rechner:

Persönliche Daten:
- Name: ${name}
- E-Mail: ${email}
- Telefon: ${phone}

Versicherungsdetails:
- Geschlecht: ${gender}
- Häufigkeit: ${frequency}
- Bereits versichert: ${hasInsurance}
- Vorherige Verletzung: ${hasInjury}

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

            const leadValue = parseInt(tariffPrice) || 10
            await trackLead(
                {
                    email: email,
                    phone: phone,
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ').slice(1).join(' '),
                },
                leadValue
            )

            // Track Datafast goal: calculator_complete
            trackCalculatorComplete('Fußball', frequency, tariffName)

            setSubmitStatus('success')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setStep(6)

        } catch (error) {
            console.error('Error submitting form:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen overflow-hidden bg-white pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 pt-8"
                    >
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
                            Finde Deine Perfekte Sportversicherung!
                        </h1>
                        <h2 className={"font-medium"}>Erhalte deine persönliche Unfallversicherungsempfehlung, perfekt abgestimmt auf deinen aktiven Lebensstil - vollig kostenlos und unverbindlich.</h2>
                    </motion.div>
                )}

                {/* Schritt 1: Geschlecht */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
                            Wer wird versichert?
                        </h2>
                        <div className="flex flex-row justify-center gap-4 max-w-2xl mx-auto">
                            {genderOptions.map((option) => (
                                <ChoiceCard
                                    key={option.name}
                                    title={option.name}
                                    icon={option.icon}
                                    onClick={() => handleGenderSelect(option.name)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Schritt 2: Häufigkeit */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Wie oft pro Woche spielst du Fußball?
                        </h2>
                        <div className="flex flex-row justify-center flex-wrap gap-3 max-w-2xl mx-auto">
                            {frequencyOptions.map((option) => (
                                <ChoiceCard
                                    key={option.name}
                                    title={option.name}
                                    image={option.image}
                                    onClick={() => handleFrequencySelect(option.name)}
                                    priority={true}
                                />
                            ))}
                        </div>

                        <div className={"flex flex-col justify-center items-center gap-4 mt-8 w-full"}>
                            <h2 className={"text-xl font-bold"}>Wusstest Du...</h2>
                            <p className={"text-center text-lg font-medium text-gray-800"}>...dass Fußball zu den verletzungsreichsten Sportarten in Deutschland zählt.
                                Laut Unfallstatistik der DGUV passieren <b>über 1,5 Millionen Sportunfälle pro Jahr </b>
                                und rund 40% davon entfallen auf <b>Fußball</b>. <br/>
                                Ein Spieler verletzt sich durchschnittlich <b>1-2 Mal pro Jahr</b>
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Schritt 3: Versicherung */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Bist du gegen Verletzungen beim Sport abgesichert?
                        </h2>
                        <div className="flex flex-row justify-center gap-3 max-w-2xl mx-auto">
                            {insuranceOptions.map((option) => (
                                <ChoiceCard
                                    key={option.name}
                                    title={option.name}
                                    image={option.image}
                                    onClick={() => handleInsuranceSelect(option.name)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Schritt 4: Verletzung */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Hast du dich schonmal beim Spielen verletzt?
                        </h2>
                        <div className="flex flex-row justify-center gap-4 max-w-2xl mx-auto">
                            {injuryOptions.map((option) => (
                                <ChoiceCard
                                    key={option.name}
                                    title={option.name}
                                    image={option.image}
                                    onClick={() => handleInjurySelect(option.name)}
                                />
                            ))}
                        </div>

                        <div className={"flex flex-col justify-center items-center gap-4 mt-8 w-full"}>
                            <h2 className={"text-xl font-bold text-center"}>Fußballverletzungen werden schnell sehr teuer.</h2>
                            <p className={"text-center text-lg font-medium text-gray-800"}>Eine einfache Behandlung wie eine Zerrung kostet oft schon <b>100–200€</b>. <br/>
                                Bei Bänderrissen liegen die <b>Gesamtkosten schnell bei 1.000–3.000€</b>.
                                Kreuzbandrisse gehören zu den teuersten Verletzungen mit <b>bis zu 12.000€</b> inklusive OP, MRT und Reha.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Schritt 5: Formular */}
                {step === 5 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-xl font-medium text-gray-900 mb-2 text-center">
                            Super, nur noch 1 Schritt bis zu Deiner persönlichen Unfallversicherungsberatung 🙌
                        </h2>
                        <h3 className={"text-2xl font-bold text-center mb-8"}>
                            Um Dir passende Unfallversicherungs-Lösungen zu zeigen, gib Deine E-Mail-Adresse an:
                        </h3>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <span className="text-2xl">👋</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
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
                                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
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
                                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-[#1a3691] focus:outline-none text-lg transition-colors"
                                        placeholder="Deine Handynummer"
                                    />
                                </div>

                                {submitStatus === 'error' && (
                                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-center">
                                        <p className="text-red-700 font-semibold">✗ Fehler beim Senden</p>
                                        <p className="text-red-600 text-sm mt-1">Bitte versuche es erneut.</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#1a3691] hover:bg-[#152a75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200"
                                >
                                    {isSubmitting ? 'Wird gesendet...' : 'Meine Empfehlung erhalten 👉'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Schritt 6: Ergebnis */}
                {step === 6 && (() => {
                    const getTariff = () => {
                        switch(frequency) {
                            case '1x pro Woche':
                                return {
                                    title: 'Small',
                                    price: '10€',
                                    features: [
                                        "1.000€ sofort aufs Konto",
                                        "Vollinvalidität: 500.000€",
                                        "Krankenhaustagegeld: 10€",
                                        "Schwerverletzung: 2.500€",
                                        "Happy Holiday",
                                        "Zahnersatz: 20.000€",
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
                                        "Zahnersatz: 20.000€",
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
                                        "Zahnersatz: 20.000€",
                                        "Premium Leistungen der SIGNAL IDUNA"
                                    ]
                                }
                            default:
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
                                    Dein perfekter Fußball-Schutz
                                </h2>
                                <p className="text-gray-700 font-semibold my-4">
                                    Als {gender === 'Männlich' ? 'Fußballspieler' : gender === 'Weiblich' ? 'Fußballspielerin' : 'Fußballspieler:in'} mit {frequency.toLowerCase()} Training solltest du dich definitiv absichern.
                                </p>
                                <p className="text-gray-700 font-semibold">
                                    Für einen geringen monatlichen Betrag bist du optimal geschützt:
                                </p>
                                <motion.div
                                    className="flex flex-col mx-auto mt-4"
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <div className="flex-1">
                                        <PricingCard
                                            title={tariff.title}
                                            price={tariff.price}
                                            priceSubtext="/Monat"
                                            features={tariff.features}
                                            catchPhrase="schon bei Kreuzbandrissen, Bänderrissen und weiteren Fußballverletzungen"
                                            isPopular={false}
                                            buttonText="Jetzt beraten lassen"
                                            buttonHref="/kontakt"
                                            buttonVariant="v3"
                                            showButton={false}
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Google Reviews Badge */}
                            <div className="text-center mb-8">
                                <a
                                    href="https://www.google.com/search?sca_esv=56cc1d46b226e482&rlz=1C1UKOV_deDE1165DE1165&sxsrf=AE3TifN4x6Y16HhJrRe6BxVvlU7-D9ImQg:1764339064823&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5xt_wqzbPBtMB-_nYo-edtriR3148wcP90sPj3SZBlswjjI6ZfvtmZAwirrcQpoSozMmTJGKB7VWvet7xmS31R5ntFF9YtI7XHe9a2wFU-6NZCir7IvMU1zrAWegeagomnfR53-x_71Vo3mhhKVE9XbPseFU3JitckJYiNNkmDVt-LSrg%3D%3D&q=SIGNAL+IDUNA+Versicherung+Mike+Allmendinger+-+Versicherungsagentur+Rezensionen&sa=X&ved=2ahUKEwi4luOZg5WRAxX88LsIHfbOGMIQ0bkNegQIIRAE&biw=1920&bih=945&dpr=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                                >
                                    <svg width="80" height="26" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                                        <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                                        <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                                        <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                                        <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                                        <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                                    </svg>

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

                                    <p className="text-gray-600 font-semibold text-sm">
                                        75+ Rezensionen
                                    </p>
                                </a>
                            </div>

                            {/* Trust Badge */}
                            <div className="text-center mt-2 bg-white">
                                <div className="flex flex-col lg:flex-row gap-2 mb-4">
                                    <p className="text-4xl font-extrabold bg-primary text-white p-2">
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

            {/* Progress Bar unten - permanent sichtbar */}
            {step < 6 && (
                <div className="fixed bottom-0 left-0 right-0 h-2 bg-gray-200 z-50">
                    <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${(step / 5) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            )}
        </div>
    )
}