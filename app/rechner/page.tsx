'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link";
import { Check, Mars, Venus } from "lucide-react";
import PricingCard from "@/app/components/PricingCard";
import Button from "@/app/components/ui/Button";
import { trackLead } from "@/app/components/MetaPixel";
import { trackEnterBirthDate, trackSportSelected, trackFrequencySelected, trackCalculatorComplete } from "@/app/components/Datafast";
import { Toaster, toast } from 'sonner';
import ChoiceCard from "@/app/fusball/components/ChoiceCard";

export default function Rechner() {
    const [step, setStep] = useState(1)
    const [gender, setGender] = useState('')
    const [sport, setSport] = useState('')
    const [frequency, setFrequency] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [birthDateError, setBirthDateError] = useState('')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const genderOptions = [
        { name: 'Männlich', icon: Mars },
        { name: 'Weiblich', icon: Venus },
    ]

    const sports = [
        { name: 'Fußball', icon: '⚽', image: '/images/rechner/soccer.jpg', catch: "schon bei Kreuzbandrissen, Bänderrissen und weiteren Fußballverletzungen" },
        { name: 'Tennis', icon: '🎾', image: '/images/rechner/tennis.jpg', catch: "schon bei Sehnenrissen, Bänderrissen und sonstigen Tennisverletzungen"},
        { name: 'Ski', icon: '⛷️', image: '/images/rechner/ski.jpg', catch: "schon bei Kreuzbandrissen, Knochenbrüchen und sonstigen Skiunfällen"},
        { name: 'Fitness', icon: '💪', image: '/images/rechner/gym.jpg', catch: "schon bei Muskelrissen, Kapselrissen und sonstigen Trainingsverletzungen" },
        { name: 'Radfahren', icon: '🚴', image: '/images/rechner/rad.jpg', catch: "schon bei Sehnenrissen, Schlüsselbeinbrüchen und sonstigen Radunfällen" },
        { name: 'Sonstiges', icon: '🏃', image: '/images/rechner/running.jpg', catch: "schon bei Rissen oder Brüchen jeder Art" },
    ]

    const frequencies = [
        '1x pro Woche',
        '2-3x pro Woche',
        '4-5x pro Woche',
        'Täglich',
        'Unregelmäßig'
    ]


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



    const handleGenderSelect = (selectedGender: string) => {
        setGender(selectedGender)
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

        setStep(4)
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

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(5)
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
        <div className="max-h-screen pb-12 px-4">
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

                {/* Schritt 2: Sportart */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Welchen Sport übst du aus?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {sports.map((s, index) => (
                                <ChoiceCard
                                    key={s.name}
                                    title={s.name}
                                    image={s.image}
                                    onClick={() => handleSportSelect(s.name)}
                                    priority={index < 3}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Schritt 3: Häufigkeit */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Wie oft übst du {sport} aus?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
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

                {/* Schritt 4: Geburtsdatum */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center pt-8"
                    >
                        <h1 className={"text-3xl font-bold mb-8"}>Fast geschafft! 🎉</h1>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Wann ist dein Geburtstag?
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

                {/* Schritt 5: Formular */}
                {step === 5 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-8"
                    >
                        <h2 className="text-xl font-medium text-gray-900 mb-2 text-center">
                            Super, nur noch 1 Schritt bis zu Deiner persönlichen Sportversicherungsberatung 🙌
                        </h2>
                        <h3 className="text-xl font-bold text-center mb-8 mt-4">
                            Um dir passende Versicherungs-Lösungen zu zeigen, lass uns wissen, wie wir dir deine Empfehlung zusenden können:
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
                                    className="w-full bg-primary hover:bg-[#152a75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-lg text-lg transition-colors duration-200 hover:cursor-pointer"
                                >
                                    {isSubmitting ? 'Wird berechnet...' : 'Meine Empfehlung erhalten 👉'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Schritt 6: Ergebnis */}
                {step === 6 && (() => {
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
                            <h2 className="text-3xl font-bold text-black mb-4 flex flex-row items-center justify-center gap-4 mt-2">
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

                            <div className="max-w-3xl mx-auto text-left space-y-4 my-4">
                                <p className="text-gray-800 font-medium">
                                    Jedes Jahr verletzen sich in Deutschland über 1,5 Millionen Menschen beim Sport.
                                    Jeder 3. aktive Sportler erleidet mindestens einmal pro Jahr eine Verletzung,
                                    die ärztliche Behandlung erfordert.
                                </p>

                                {sport === 'Fußball' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Als Fußballspieler</strong> bist Du besonders gefährdet: Über 600.000 Fußballverletzungen
                                        passieren jährlich in Deutschland. 20% davon sind schwere Verletzungen wie Kreuzbandrisse
                                        oder Bänderrisse. Ein Kreuzbandriss bedeutet 6-9 Monate Pause und Kosten bis zu 12.000€.
                                    </p>
                                )}

                                {sport === 'Tennis' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Als Tennisspieler</strong> erleidest Du besonders häufig Sehnenrisse (Achillessehne,
                                        Rotatorenmanschette) und Überlastungsschäden. Eine Rotatorenmanschettenriss-OP kostet
                                        8.000-15.000€ und erfordert 6-12 Monate Rehabilitation.
                                    </p>
                                )}

                                {sport === 'Ski' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Beim Skifahren</strong> passieren die teuersten Unfälle: Kreuzbandrisse,
                                        Schlüsselbeinbrüche und Schulterverletzungen. Durchschnittliche Kosten pro Unfall: 8.500€.
                                        Hinzu kommen oft Bergungskosten von bis zu 5.000€.
                                    </p>
                                )}

                                {sport === 'Fitness' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Im Fitnessstudio</strong> sind Muskelrisse, Kapselrisse und Sehnenentzündungen
                                        die häufigsten Verletzungen. Besonders betroffen: Schulter, Knie und Rücken.
                                        Behandlungskosten inkl. Physiotherapie: 2.500-5.000€ pro Verletzung.
                                    </p>
                                )}

                                {sport === 'Radfahren' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Als Radfahrer</strong> bist Du besonders gefährdet für Schlüsselbeinbrüche,
                                        Handgelenksverletzungen und Sehnenrisse. Bei Stürzen kommen oft mehrere Verletzungen
                                        zusammen. Kosten für Behandlung und Reha: 3.000-10.000€.
                                    </p>
                                )}

                                {sport === 'Sonstiges' && (
                                    <p className="text-gray-800 font-medium">
                                        <strong>Beim Sport</strong> können Verletzungen jeden treffen und schnell teuer werden.
                                        Die durchschnittlichen Behandlungskosten bei Sportverletzungen liegen bei 2.300€ –
                                        ohne Berücksichtigung von Folgekosten oder Verdienstausfall.
                                    </p>
                                )}

                                <p className="text-gray-800 font-medium">
                                    Die häufigsten Sportverletzungen sind Bänderrisse (40%), Knochenbrüche (25%),
                                    Sehnenrisse (20%) und Kreuzbandrisse (15%). Die Kosten: Von einfachen Zerrungen (150-300€)
                                    über Bänderrisse (1.500-3.500€) bis zu Kreuzbandrissen (bis zu 12.000€).
                                </p>

                                <p className="text-gray-800 font-semibold">
                                    Mit Deiner Sportversicherung bist Du für nur {tariff.price}/Monat abgesichert:
                                </p>
                            </div>
                        </div>

                        <Button text={"Jetzt Termin vereinbaren"} variant={"secondary"} size={"lg"} className={"mb-6"}
                                href={"https://signal-iduna-agentur.de/mike.allmendinger/termin-vereinbaren/?advnr=7156292"}/>

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