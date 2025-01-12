import React from 'react';

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked = false, onCheckedChange, disabled = false, className = '' }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                ref={ref}
                disabled={disabled}
                className={`
          relative inline-flex h-7 w-12 items-center rounded-full 
          transition-colors duration-200 ease-in-out
          ${checked ? 'bg-black' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${className}
        `}
                onClick={() => onCheckedChange?.(!checked)}
            >
                <span className="sr-only">{checked ? 'On' : 'Off'}</span>
                <div
                    className={`
            absolute left-1 flex h-5 w-5 transform items-center justify-center 
            rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
                />
            </button>
        );
    }
);

Switch.displayName = 'Switch';

export default Switch;