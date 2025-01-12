import { createSlice, nanoid } from "@reduxjs/toolkit";
import { Category } from "../../types";

export interface CategoriesState {
  catogeries: Category[];
}

const initialState: CategoriesState = {
  catogeries: [
    {
      id: "151616",
      name: "Shoes",
    },
    {
      id: "1516112",
      name: "T-Shirt",
    },
  ],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const category = {
        id: nanoid(),
        name: action.payload,
      };
      state.catogeries.push(category);
    },
    removeCategory: (state, action) => {
      state.catogeries = state.catogeries.filter(
        (category) => category.id !== action.payload
      );
    },
    updateCategory: () => {},
  },
});

export const { addCategory, removeCategory, updateCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
