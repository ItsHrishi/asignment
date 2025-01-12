export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  variants: Variant[];
  combinations: Record<string, Combination>;
  priceInr: number;
  discount: Discount;
}

export interface Variant {
  name: string;
  values: string[];
}

export interface Combination {
  name: string;
  sku: string;
  quantity: number | null;
  inStock: boolean;
}

export interface Discount {
  method: "pct" | "flt";
  value: number;
}

export interface Category {
  id: string;
  name: string;
}

export type ButtonVariant = "normal" | "soft" | "outlined" | "text";
