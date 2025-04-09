// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./Pages/components/Header";
import ContentList from "./Pages/components/ContentList";
import ProductGallery from "./Pages/components/ProductGallery";
import { CartItem, Category } from "./types";

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
    { id: "3", name: "Accessories" },
  ]);

  const getCategoryIdByName = (categoryName: string): string | null => {
    const category = categories.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };

  const addToCart = (product: any, selectedAttributes: any) => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      attributes: selectedAttributes,
      quantity: 1,
    };

    setCartItems((prevCartItems) => {
      const newItemKey = JSON.stringify(newItem.attributes);
      const existingIndex = prevCartItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.attributes) === newItemKey
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCartItems];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCartItems, newItem];
      }
    });
  };

  const increaseQuantity = (productId: number, selectedAttributes: any) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(selectedAttributes)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number, selectedAttributes: any) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((item) =>
          item.id === productId &&
          JSON.stringify(item.attributes) === JSON.stringify(selectedAttributes)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toKebabCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return (
    <BrowserRouter>
      <Header
        cartItems={cartItems}
        setCartItems={setCartItems}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        toKebabCase={toKebabCase}
      />
      <Routes>
        <Route
          path="/:categoryName"
          element={
            <ContentList addToCart={addToCart} toKebabCase={toKebabCase} />
          }
        />
        <Route
          path="/:categoryName/product/:productId"
          element={
            <ProductGallery addToCart={addToCart} toKebabCase={toKebabCase} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
