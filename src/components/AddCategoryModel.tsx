import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { addCategory } from "../store/features/categorySlice";

interface AddCategoryModelProps {
    isOpen: boolean;
    onClose: (arg: boolean) => void;
}

const AddCategoryModel = ({ isOpen, onClose }: AddCategoryModelProps) => {
    const [categoryName, setCategoryName] = useState<string>("");
    const [errorState, setErrorState] = useState<string>("");
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            setErrorState("");
            setCategoryName("");
            inputRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryName.length < 2) {
            setErrorState("Category name length should be greater than 2");
            return;
        } else {
            setErrorState("");
            console.log("Category name:", categoryName);
            dispatch(addCategory(categoryName));
            setCategoryName("");
            onClose(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-light text-sm">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-4">
                {/* Modal Header */}
                <div>
                    <h2 className="text-lg font-semibold">Add category</h2>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="mt-4 ">
                    <Input
                        ref={inputRef}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        label="Category name *"
                        required
                    />
                    {errorState && <p className="text-red-500 text-sm mt-2">{errorState}</p>}
                </form>

                {/* Modal Footer */}
                <div className="p-4 flex justify-end space-x-2">
                    <Button
                        onClick={() => {
                            setErrorState("");
                            setCategoryName("");
                            onClose(false);
                        }}
                        variant="soft"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModel;
