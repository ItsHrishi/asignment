
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import Tag from "./Tag";
import { ChevronRight, ImageUp } from "lucide-react";
import { Category, Variants } from "../types";



interface FormData {
    productName: string;
    category: string;
    brand: string;
    image: FileList | null;
}

interface AddProductFormProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    handleNext: () => void;
    handleBack: () => void;
}

const AddProductForm = ({ currentStep, setCurrentStep, handleNext, handleBack }: AddProductFormProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [variants, setVariants] = useState<Variants[]>([
        {
            values: [],
            names: ""
        }
    ])
    const [combination, setCombination] = useState<Category[]>()

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        // Trigger the hidden file input click
        fileInputRef.current?.click();
    };
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            productName: "",
            category: "",
            brand: "",
            image: null,
        },
    });

    const onSubmit = (data: FormData) => {
        console.log("Form Data:", data);
        if (currentStep < steps.length - 1) {
            handleNext();
        } else {
            // Final submission logic
            alert("Form submitted successfully!");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <Controller
                            name="productName"
                            control={control}
                            rules={{ required: "Product name is required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Product name *"
                                    placeholder="Enter product name"
                                    className={errors.productName && "border-red-500"}
                                />
                            )}
                        />
                        {errors.productName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.productName.message}
                            </p>
                        )}
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Category *"
                                    placeholder="Enter category"
                                    className={errors.category && "border-red-500"}
                                />
                            )}
                        />
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category.message}
                            </p>
                        )}
                        <Controller
                            name="brand"
                            control={control}
                            rules={{ required: "Brand is required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Brand *"
                                    placeholder="Enter brand"
                                    className={errors.brand && "border-red-500"}
                                />
                            )}
                        />
                        {errors.brand && (
                            <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                        )}
                        <div className="mt-4">
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                // onChange={handleFileChange}
                                className="hidden"
                            />
                            {/* Button to trigger file input */}
                            <Button variant="outlined" onClick={handleButtonClick}>
                                <ImageUp /> <span>Upload Image</span>
                            </Button>
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>
                    </>
                );
            case 1:
                return (<>Variants</>)
            case 2:
                return (<>Combinations</>)
            case 2:
                return (<>Price info</>)
            default:
                return <p>Unknown step</p>;
        }
    };

    return (
        <div className="bg-white w-full h-full">
            <div className="flex items-center space-x-2 text-sm m-6">
                {steps.map((step, index) => (
                    <div
                        key={step}
                        className={`flex items-center text-gray-500 cursor-default `}
                    >
                        {index <= currentStep ? <Tag text={step} /> : <span>{step}</span>}

                        {index < steps.length - 1 && <span className="mx-2"></span>}
                        {index < 3 ? <ChevronRight /> : null}
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.15)] max-w-lg m-6 mt-8">

                <div className="mb-4">
                    <h3>{steps[currentStep]}</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {renderStepContent()}
                </form>
            </div>
        </div>
    );
};



export default AddProductForm