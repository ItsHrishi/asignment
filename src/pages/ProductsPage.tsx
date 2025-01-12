import { useSelector } from "react-redux"
import Button from "../components/Button"
import { CategoriesState } from "../store/features/categorySlice"
import Tag from "../components/Tag"
import AddCategoryModel from "../components/AddCategoryModel"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ProductsState } from "../store/features/productSlice"

const ProductsPage = () => {
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = useSelector((state: { category: CategoriesState }) => state.category.catogeries);
    const products = useSelector((state: { product: ProductsState }) => state.product.products);

    // console.log("products : ", products)
    return (
        <div className="flex flex-col h-full">
            <AddCategoryModel isOpen={isModalOpen} onClose={setIsModalOpen} />
            <header className="flex justify-between items-center p-4 bg-white">
                <h2 className="text-xl font-medium">Products</h2>
                <div className="space-x-4 flex">
                    <Button variant="soft" onClick={() => setIsModalOpen(true)}>
                        Add Category
                    </Button>
                    <Button onClick={() => navigate("/add-product")} >
                        Add Product
                    </Button>
                </div>
            </header>
            <div className="p-4 h-full bg-white">
                <div className="flex md:flex-row gap-4 md:h-[95%] flex-col overflow-auto">
                    {categories.map((category, index) => (
                        <div key={index} className="bg-gray-100 h-full rounded-md md:min-w-64 lg:min-w-80 p-4 flex flex-col gap-4 ">
                            <p>{category.name}</p>
                            <div className="flex w-full md:flex-col gap-3 overflow-auto">
                                {/* products mapping */}
                                {products.map((product) =>
                                    product.category === category.id &&
                                    <div key={product.id} className="flex items-center gap-4 p-2 bg-white shadow rounded-lg max-w-md">
                                        {/* Image */}
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.image ? product.image : "./noimage.avif"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col flex-grow ">
                                            <h3 className="text-base font-normal text-gray-950">{product.name}</h3>
                                            <p className="text-gray-700 font-light mb-3">₹{product.priceInr}</p>
                                            <Tag text={product.brand} />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductsPage