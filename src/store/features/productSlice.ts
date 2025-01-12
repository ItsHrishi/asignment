import { createSlice, nanoid } from "@reduxjs/toolkit";
import { Product } from "../../types";

export interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: [
    {
      id: "1234",
      name: "Nike Jordan",
      category: "151616",
      brand: "Nike",
      image: "/shoes.png",
      variants: [
        {
          name: "Size",
          values: ["M", "L"],
        },
        {
          name: "Color",
          values: ["Black", "Red"],
        },
      ],
      combinations: {
        a: {
          name: "M/Black",
          sku: "ABC12",
          quantity: 4,
          inStock: false,
        },
        b: {
          name: "L/Red",
          sku: "ABC12",
          quantity: null,
          inStock: true,
        },
      },
      priceInr: 500,
      discount: {
        method: "pct", // pct | flat
        value: 12,
      },
    },
  ],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = {
        id: nanoid(),
        ...action.payload,
      };
      state.products.push(product);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((product) => {
        product.id !== action.payload;
      });
    },
    updateProduct: () => {},
  },
});

export const { addProduct, removeProduct, updateProduct } =
  productSlice.actions;

export default productSlice.reducer;
