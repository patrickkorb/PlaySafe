
import Image from "next/image";

export interface CarouselItemProps {
    id: number;
    backgroundImage: string;
    userImage: string;
    userName: string;
    userAge: number;
    story: string;
}

export default function CarouselItem({ 
    backgroundImage, 
    userImage, 
    userName, 
    userAge, 
    story 
}: CarouselItemProps) {
    return (
        <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
            {/* Background Image */}
            <Image 
                src={backgroundImage} 
                alt="Background" 
                fill 
                className="object-cover z-0" 
            />
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            {/* Content */}
            <div className="relative z-20 p-6 md:p-8 h-full flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-4">
                    {/* User Profile Image - Larger */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <Image 
                            src={userImage} 
                            alt={userName} 
                            fill 
                            className="object-cover" 
                        />
                    </div>
                    
                    {/* User Info - Left aligned */}
                    <div>
                        <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">{userName}</h3>
                        <p className="text-white/90 text-lg md:text-xl">{userAge} Jahre</p>
                    </div>
                </div>
                
                {/* Story Text */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6">
                    <p className="text-white text-sm md:text-base leading-relaxed italic">
                        "{story}"
                    </p>
                </div>
            </div>
        </div>
    )
}