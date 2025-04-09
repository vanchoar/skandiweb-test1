import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Pages/components/Header";
import ContentList from "./Pages/components/ContentList";
import ProductGallery from "./Pages/components/ProductGallery";
import { CartItem } from "./types";

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const query = {
        query: `
          {
            categories {
              id
              name
            }
          }
        `,
      };

      try {
        const res = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });

        const json = await res.json();
        if (json.data?.categories) {
          setCategories(json.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addToCart = (product: any, selectedAttributes: any) => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      attributes: selectedAttributes,
      quantity: 1,
    };

    setCartItems((prev) => {
      const newKey = JSON.stringify(newItem.attributes);
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === newItem.id && JSON.stringify(item.attributes) === newKey
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, newItem];
      }
    });
  };

  const increaseQuantity = (productId: number, selectedAttributes: any) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(selectedAttributes)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number, selectedAttributes: any) => {
    setCartItems((prev) =>
      prev
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
      .replace(/[^a-z0-9-#]/g, "");

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
        {/* Redirect / to first category */}
        <Route
          path="/"
          element={
            categories.length > 0 ? (
              <Navigate to={`/${toKebabCase(categories[0].name)}`} replace />
            ) : (
              <div>Loading...</div>
            )
          }
        />

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
