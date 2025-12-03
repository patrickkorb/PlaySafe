import { LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface ChoiceCardProps {
    title: string
    image?: string
    icon?: LucideIcon
    emoji?: string
    onClick: () => void
    priority?: boolean
}

export default function ChoiceCard({ title, image, icon: Icon, emoji, onClick, priority = false }: ChoiceCardProps) {
    // Layout mit Bild: 3/5 Bild oben, 2/5 Text unten
    if (image) {
        return (
            <button
                onClick={onClick}
                className="bg-white border-2 border-gray-300 hover:border-[#1a3691] hover:shadow-lg rounded-xl transition-all duration-200 flex flex-col w-full max-w-[calc(50%-8px)] overflow-hidden"
            >
                {/* Bild Container - 3/5 der Höhe */}
                <div className="flex items-center justify-center bg-gray-50 rounded-t-lg h-[108px] w-full relative">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        quality={75}
                        priority={priority}
                        loading={priority ? 'eager' : 'lazy'}
                    />
                </div>

                {/* Text Container - 2/5 der Höhe */}
                <div className="flex items-center justify-center h-[72px] w-full p-2">
                    <div className="text-base font-semibold text-gray-900 text-center">
                        {title}
                    </div>
                </div>
            </button>
        )
    }

    // Layout mit Icon/Emoji: zentriert
    return (
        <button
            onClick={onClick}
            className="bg-white border-2 border-gray-300 hover:border-[#1a3691] hover:shadow-lg rounded-xl transition-all duration-200 flex flex-col items-center gap-4 w-[150px] h-[180px]"
        >
            {/* Icon/Emoji Container */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg h-full w-full">
                {Icon && (
                    <Icon className="w-12 h-12 text-[#1a3691]" />
                )}
                {emoji && (
                    <span className="text-6xl">{emoji}</span>
                )}
                <div className="text-xl font-semibold text-gray-900 text-center p-2">
                    {title}
                </div>
            </div>
        </button>
    )
}
