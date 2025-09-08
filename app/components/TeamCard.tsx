import Image from "next/image";

export interface TeamCardProps {
    firstname: string;
    lastname: string;
    image?: string;
}

export default function TeamCard( {firstname, lastname, image = "/images/placeholder.png"}: TeamCardProps) {
    return (
        <div className="relative w-80 h-96 rounded-lg overflow-hidden">
            <Image 
                src={image} 
                alt={`${firstname} ${lastname}`} 
                fill 
                className="object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold drop-shadow-lg">{firstname}</h3>
                <h3 className="text-xl font-bold drop-shadow-lg">{lastname}</h3>
            </div>
        </div>
    )
}