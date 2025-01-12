import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Combination, Variant } from "../types";
import Input from "../components/Input";
import { ChevronRight, ImageUp, Trash2, PlusIcon, X } from "lucide-react";
import Tag from "../components/Tag";
import TagInput from "../components/TagInput";
import Switch from "../components/Switch";
import { useDispatch, useSelector } from "react-redux";
import { CategoriesState } from "../store/features/categorySlice";
import { addProduct } from "../store/features/productSlice";


interface FormData {
    productName: string;
    category: string;
    brand: string;
    image: string | null;
    price: number | null;
    discountMethod: "flt" | "pct";
    discountValue: number;
    variants: Variant[];
    combinations: Combination[]
}

const steps = ["Description", "Variants", "Combinations", "Price info"];

const AddProductPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [currentStep, setCurrentStep] = useState(0);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileKey, setFileKey] = useState(0);

    const categories = useSelector((state: { category: CategoriesState }) => state.category.catogeries);




    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            productName: "",
            category: "",
            brand: "",
            image: null,
            price: null,
            discountMethod: "pct",
            discountValue: 0,
            variants: [{
                name: "",
                values: []
            }],
            combinations: [
                {
                    name: "",
                    sku: "",
                    quantity: 0,
                    inStock: true,
                }
            ]
        },
    });

    const image = watch("image")
    const discountMethod = watch("discountMethod");
    const variants = watch("variants")
    const combinations = watch("combinations");

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }
    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        } else {
            alert("Form submitted successfully!");
        }
    };

    const onSubmit = handleSubmit((data: FormData) => {
        if (currentStep < steps.length - 1) {
            handleNext();
        } else {
            const productData = {
                name: data.productName,
                category: data.category,
                brand: data.brand,
                image: data?.image ? data?.image : "",
                variants: data.variants,
                combinations: data.combinations.reduce((acc, combo, index) => ({
                    ...acc,
                    [String.fromCharCode(97 + index)]: { // will generate 'a', 'b', 'c', etc.
                        name: combo.name,
                        sku: combo.sku,
                        quantity: combo.quantity,
                        inStock: combo.inStock
                    }
                }), {}),
                priceInr: data.price ? data.price : 0,
                discount: {
                    method: data.discountMethod,
                    value: data.discountValue,
                }

            }
            dispatch(addProduct(productData));
            navigate("/");
        }
    })

    const { fields, append, remove } = useFieldArray({
        name: "variants",
        control
    })
    const { fields: fields2, replace: replace2 } = useFieldArray({
        control,
        name: 'combinations',
    });



    const generateCombinations = useCallback((variants: Variant[]): Combination[] => {

        if (!variants?.length) return [];

        const validVariants = variants.filter(v =>
            v.name &&
            Array.isArray(v.values) &&
            v.values.length > 0
        );

        if (!validVariants.length) return [];

        const cartesianProduct = (...arrays: string[][]): string[][] => {
            return arrays.reduce<string[][]>(
                (acc, curr) => acc.flatMap(combo => curr.map(item => [...combo, item])),
                [[]]
            );
        };
        const variantValues = validVariants.map(v => v.values);

        const combinations = cartesianProduct(...variantValues);

        return combinations.map(combo => ({
            name: combo.join('/'),
            sku: '',
            quantity: 0,
            inStock: true,
        }));
    }, [])

    // Update combinations
    useEffect(() => {
        try {
            const newCombinations = generateCombinations(variants);
            if (newCombinations.length > 0) {
                replace2(newCombinations);
            }
        } catch (error) {
            console.error("Error generating combinations:", error);
        }
    }, [JSON.stringify(variants), replace2]);



    // Trigger the hidden file input click
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    // Handles image file upload and conversion to base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert('File is too large. Maximum size is 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            const reader = new FileReader();
            reader.onerror = () => {
                alert('Error reading file');
            };
            reader.onload = () => {
                if (reader.result) {
                    setValue("image", reader.result as string, { shouldValidate: true });
                }
            };
            reader.readAsDataURL(file);
        }
    };



    // form steps
    const renderStepContent = () => {
        switch (currentStep) {
            // step 1 :
            case 0:
                return (
                    <div className="flex flex-col gap-4">
                        <div>
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
                                <p className="text-red-500 text-xs my-1 ml-1">
                                    {errors.productName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                    <div className="">
                                        <label className="block pl-1 font-light text-sm mb-1">Category *</label>
                                        <select
                                            {...field}
                                            className={`appearance-none px-3 py-2 cursor-pointer rounded-lg bg-white text-gray-900 text-sm outline-none duration-200 border focus:ring-2 focus:ring-primaryBlue w-full ${errors.category ? "border-red-500" : "border-gray-200"
                                                }`}
                                        >
                                            <option value="" disabled>
                                                Select a category
                                            </option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id} >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-500 text-xs my-1 ml-1">{errors.category.message}</p>
                                        )}
                                    </div >
                                )}
                            />
                        </div>
                        <div>
                            < Controller
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
                            {
                                errors.brand && (
                                    <p className="text-red-500 text-xs my-1 ml-1">{errors.brand.message}</p>
                                )
                            }
                        </div>
                        <div>
                            {/* Hidden file input */}
                            <input
                                key={fileKey}
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {/* Button to trigger file input */}
                            <Button
                                variant="outlined"
                                onClick={handleButtonClick}
                            >
                                <ImageUp /> <span>Upload Image</span>
                            </Button>
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                            {image && (
                                <div className="relative mt-4 h-40 w-fit">
                                    <img
                                        src={image}
                                        alt="Product"
                                        className="h-full object-cover border-2 border-primaryBlue rounded-md"

                                    />
                                    <button
                                        onClick={() => {
                                            setValue("image", null)
                                            setFileKey(prev => prev + 1);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 p-1 h-6 w-6 min-w-0 bg-slate-100 hover:bg-gray-100 rounded-full shadow-md cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            // step 2 :
            case 1:
                return <div className="flex flex-col gap-2">
                    {fields.map((field, index) => (
                        <div className="grid grid-cols-9 gap-2" key={field.id}>
                            <div className="col-span-3">
                                <div className="w-full font-light text-sm">
                                    {index < 1 && (
                                        <label className="inline-block mb-1 pl-1">
                                            Option
                                        </label>
                                    )}
                                    <input
                                        {...register(`variants.${index}.name`,
                                            { required: "Option can't be empty" })}
                                        placeholder="Option Name"
                                        className={`text-md px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border  w-full ${errors.variants?.[index]?.name ? "border-red-500" : "border-gray-200"}`}
                                    />
                                </div>
                                {errors.variants?.[index]?.name && (
                                    <p className="text-red-500 text-xs my-1 ml-1">
                                        {errors.variants[index].name?.message}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-5">
                                <div className="w-full font-light text-sm">
                                    {index < 1 && (
                                        <label className="inline-block mb-1 pl-1">
                                            Values
                                        </label>
                                    )}
                                    <TagInput<FormData>
                                        control={control}
                                        name={`variants.${index}.values`}
                                        placeholder="Press space or enter to add values"
                                        isError={errors.variants?.[index]?.values ? true : false}
                                    />
                                </div>
                                {errors.variants?.[index]?.values && (
                                    <p className="text-red-500 text-xs my-1 ml-1">
                                        {errors.variants[index].values?.message}
                                        Values are required
                                    </p>
                                )}
                            </div>
                            <div className="flex items-end pb-2 text-red-600 justify-center col-span-1">
                                <Trash2
                                    size="20"
                                    onClick={() => { if (index > 0) remove(index) }}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                    <div>
                        <Button
                            variant="text"
                            onClick={(e) => {
                                e.preventDefault();
                                append({ name: "", values: [] });
                            }}
                        >
                            <PlusIcon size="20" />
                            Add Option
                        </Button>
                    </div>
                </div>
            // step 3 : 
            case 2:
                return (
                    <div >
                        <div className="grid grid-cols-12 gap-4 font-light text-sm">
                            <div className="col-span-3">
                                {/* Empty space  */}
                            </div>
                            <div className="col-span-3">
                                <label >SKU *</label>
                            </div>
                            <div className="col-span-3 flex items-center justify-center">
                                <label >In Stock</label>
                            </div>
                            <div className="col-span-3">
                                <label >Quantity</label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-1">
                            {fields2.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-3">
                                        <span className="font-light text-sm">{field.name}</span>
                                    </div>

                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            {...register(`combinations.${index}.sku`, {
                                                required: "SKU is required", validate: (value) => {
                                                    // Get all SKUs
                                                    const allSkus = combinations.map(c => c.sku);
                                                    // Filter out current SKU and check if value exists in other SKUs
                                                    const otherSkus = allSkus.filter((_, i) => i !== index);
                                                    return !otherSkus.includes(value) || "Duplicate SKU";
                                                },
                                            })}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border  ${errors.combinations?.[index]?.sku ? "border-red-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-primaryBlue`}
                                            placeholder="SKU code"
                                        />
                                        {errors.combinations?.[index]?.sku && (
                                            <p className="text-red-500 text-xs my-1 ml-1">
                                                {errors.combinations[index]?.sku?.message}

                                            </p>
                                        )}

                                    </div>

                                    <div className="col-span-3 flex items-center justify-center">
                                        <Switch
                                            checked={combinations[index]?.inStock ?? false}
                                            onCheckedChange={(checked) => {
                                                setValue(`combinations.${index}.inStock`, checked, {
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            {...register(`combinations.${index}.quantity`, {
                                                valueAsNumber: true,
                                                min: 0,
                                                value: 0
                                            })}
                                            disabled={!combinations[index]?.inStock}
                                            value={!combinations[index]?.inStock ? '' : (watch(`combinations.${index}.quantity`) || 0)}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                setValue(`combinations.${index}.quantity`, value);
                                            }}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primaryBlue 
        ${!combinations[index]?.inStock ? 'bg-gray-200' : 'bg-white'}`}
                                            placeholder={!combinations[index]?.inStock ? "" : "Quantity"}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>)
            // step 4 : 
            case 3:
                return (
                    <div className="flex flex-col gap-4">
                        <div>
                            <Controller
                                name="price"
                                control={control}
                                rules={{ required: "Price is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        label="Price *"
                                        placeholder="Enter product price"
                                        className={errors.price && "border-red-500"}
                                        value={field.value ?? 0}
                                    />
                                )}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs my-1 ml-1">{errors.price.message}</p>
                            )}
                        </div>

                        <div className="flex flex-row gap-2 items-center justify-between h-full">
                            <Controller
                                name="discountValue"
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <div className="w-full font-light text-sm">
                                        <label className="inline-block mb-1 pl-1">
                                            Discount
                                        </label>
                                        <input
                                            type="number"
                                            {...field}
                                            value={field.value || 0}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                field.onChange(value);
                                            }}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                                            placeholder="Enter discount value"
                                            min={0}
                                        />
                                    </div>
                                )}
                            />
                            <div className="flex items-center space-x-2 border rounded-md mt-auto ">
                                <button
                                    type="button"
                                    className={`px-3 py-1 pb-1  ${discountMethod !== "pct" ? "bg-gray-200" : ""}`}
                                    onClick={() => setValue("discountMethod", "pct")}
                                >
                                    %
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-1 pb-1 ${discountMethod !== "flt" ? "bg-gray-200" : ""}`}
                                    onClick={() => setValue("discountMethod", "flt")}
                                >
                                    $
                                </button>
                            </div>
                        </div>


                        {errors.discountValue && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.discountValue.message}
                            </p>
                        )}
                    </div>
                );

        }
    };


    return (
        <div className="flex flex-col h-full">

            <header className="flex justify-between items-center px-4 pt-4 pb-2 bg-white">
                <h2 className="text-xl font-medium">Products</h2>
                <div className="space-x-4 flex">
                    {currentStep === 0 ? <Button className="w-28" variant="soft" onClick={() => navigate("/")} >
                        Cancel
                    </Button> :
                        <Button className="w-28" variant="soft" onClick={handleBack}>Back</Button>
                    }

                    {currentStep === 3 ? <Button className="w-28" onClick={onSubmit} >
                        Submit
                    </Button> :
                        <Button onClick={onSubmit} className="w-28" >
                            Next
                        </Button>
                    }

                </div>
            </header>
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

                    <form className="space-y-4">
                        {renderStepContent()}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProductPage