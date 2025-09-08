import Link from "next/link";

interface ButtonProps {
    text: string;
    href: string;
    className?: string;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
}

export default function Button({ 
    text, 
    href, 
    className = "", 
    variant = "primary",
    size = "md"
}: ButtonProps) {
    const baseClasses = "inline-block w-full text-center font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95";
    
    const sizeClasses = {
        sm: "py-2 px-4 text-sm",
        md: "py-3 px-6 text-base",
        lg: "py-4 px-8 text-lg"
    };
    
    const variantClasses = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm hover:shadow-md"
    };
    
    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
    
    return (
        <Link href={href} className={combinedClasses}>
            {text}
        </Link>
    );
}