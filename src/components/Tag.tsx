import React from "react";

interface TagProps {
    text: string;
    className?: string;
}
const Tag: React.FC<TagProps> = ({ text, className = "" }) => {
    return (
        <div>
            <span
                className={`inline-flex px-3 py-1 text-primaryBlue bg-lightBlue rounded-md text-sm font-medium ${className}`}
            >
                {text}
            </span>
        </div>
    );
};
export default Tag;
