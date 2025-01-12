import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TagInputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    className?: string;
    placeholder?: string;
    isError: boolean
}

const TagInput = <T extends FieldValues>({
    name,
    control,
    className = '',
    placeholder = "Press space or enter to add tags",
    isError
}: TagInputProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        onChange: (value: string[]) => void,
        currentTags: string[]
    ): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (inputValue.trim()) {
                const newTags = inputValue.trim().split(' ').filter(tag => tag !== '');
                onChange([...currentTags, ...newTags]);
                setInputValue('');
            }
        }
    };

    const removeTag = (
        indexToRemove: number,
        onChange: (value: string[]) => void,
        currentTags: string[]
    ): void => {
        onChange(currentTags.filter((_, index) => index !== indexToRemove));
    };

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === containerRef.current) {
            inputRef.current?.focus();
        }
    };

    useEffect(() => {
        const updateInputWidth = (): void => {
            if (containerRef.current && inputRef.current) {
                const container = containerRef.current;
                const containerWidth = container.offsetWidth;

                const tags = Array.from(container.children).filter(child =>
                    child !== inputRef.current
                );

                const tagsWidth = tags.reduce((width, child) => {
                    return width + child.getBoundingClientRect().width + 8;
                }, 0);

                if (tagsWidth === 0) {
                    inputRef.current.style.width = `${containerWidth - 24}px`;
                    return;
                }

                const availableWidth = containerWidth - tagsWidth - 24;
                const minWidth = Math.min(120, containerWidth - 24);

                inputRef.current.style.width = `${Math.max(minWidth, availableWidth)}px`;
            }
        };

        const resizeObserver = new ResizeObserver(updateInputWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        updateInputWidth(); // Initial calculation
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
                <div className={`w-full ${className}`}>
                    <div
                        ref={containerRef}
                        onClick={handleContainerClick}
                        className={`flex flex-wrap items-center gap-2 text-md px-3 py-2 rounded-lg bg-white text-black focus-within:bg-gray-50 duration-200 border ${isError ? "border-red-500" : ""} border-gray-200 cursor-text min-h-[42px]`}
                    >
                        {value?.map((tag: string, index: number) => (
                            <div
                                key={index}
                                className="flex items-center gap-1 px-2 bg-gray-200 text-black rounded-md text-sm"
                            >
                                <span>{tag}</span>
                                <button
                                    onClick={() => removeTag(index, onChange, value)}
                                    className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                                    type="button"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <input
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleKeyDown(e, onChange, value || [])}
                            className="outline-none bg-transparent flex-1 min-w-[60px]"
                            placeholder={value?.length === 0 ? placeholder : ""}
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default TagInput;