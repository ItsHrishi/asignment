import { Link } from "react-router-dom";

const UnderDevelopment = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 font-bold text-center">
            <p className="text-2xl uppercase tracking-widest mb-4">
                This page is under development
            </p>
            <Link
                to="/products"
                className="text-blue-600 underline hover:text-blue-800 text-lg"
            >
                Go to Products
            </Link>
        </div>
    );
};

export default UnderDevelopment