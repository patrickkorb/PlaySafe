import Link from "next/link";

interface ButtonProps {
    text: string;
    href: string;
    className?: string;
    variant?: "primary" | "secondary" | "v3";
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
        secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md",
        v3: "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg"
    };
    
    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
    
    return (
        <Link href={href} className={combinedClasses}>
            {text}
        </Link>
    );
}