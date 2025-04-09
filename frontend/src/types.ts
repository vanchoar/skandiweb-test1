export type CartItem = {
  id: number;
  name: string;
  price: {
    amount: number;
    currency_symbol: string;
  };
  gallery: { image_url: string }[];
  attributes: { name: string; displayValue: string; value: string }[];
  quantity: number;
}


export type Attribute = {
  name: string;
  items: { displayValue: string; value: string }[];
};

export interface ProductAttributeItem {
  id: number;
  displayValue: string;
  value: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  items: ProductAttributeItem[];
}

export interface ProductPrice {
  amount: number;
  currency_symbol: string;
}

export interface CartExpandProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  getTotalQuantity: (cartItems: CartItem[]) => number;
  increaseQuantity: (productId: number, attributes: any) => void;
  decreaseQuantity: (productId: number, attributes: any) => void;
  toKebabCase: (value: string) => string;
}

export interface ProductGalleryItem {
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: ProductPrice;
  gallery: ProductGalleryItem[];
  inStock: number;
  category: string;
  attributes: ProductAttribute[];
}

export type SelectedAttribute = {
  id: number;
  name: string;
  displayValue: string;
  value: string;
};