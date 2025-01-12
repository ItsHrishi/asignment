import React, { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "../types";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "normal",
    className = "",
    ...props
}) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
        normal: "bg-primaryBlue text-white hover:bg-[#1a7ab8] active:bg-[#166ca3]",
        soft: "bg-customGray text-primaryBlue hover:bg-[#d1dbe2] active:bg-[#c4d1da]",
        outlined: "border border-primaryBlue text-primaryBlue hover:bg-[#f0f8ff] active:bg-[#e0f2ff]",
        text: "bg-transparent text-primaryBlue hover:bg-[#f0f8ff] active:text-[#166ca3]",
    };

    const variantStyles = variants[variant];

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
