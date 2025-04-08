import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./Pages/components/Header";
import ContentList from "./Pages/components/ContentList";
import ProductGallery from "./Pages/components/ProductGallery";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedAttributes) => {
    // Create a new cart item object.
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      attributes: selectedAttributes,
      quantity: 1,
    };

    setCartItems((prevCartItems) => {
      // Create a key from the new item's attributes for comparison.
      const newItemKey = JSON.stringify(newItem.attributes);

      // Find if there's an existing item with the same product id and attributes.
      const existingIndex = prevCartItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.attributes) === newItemKey
      );

      if (existingIndex !== -1) {
        // If found, increment the quantity.
        const updatedCart = [...prevCartItems];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        // Otherwise, add the new item.
        return [...prevCartItems, newItem];
      }
    });
  };

  const increaseQuantity = (productId, selectedAttributes) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(selectedAttributes)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId, selectedAttributes) => {
    setCartItems(
      (prevCartItems) =>
        prevCartItems
          .map((item) =>
            item.id === productId &&
            JSON.stringify(item.attributes) ===
              JSON.stringify(selectedAttributes)
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  // const capitalize = (str: any) => str.charAt(0).toUpperCase() + str.slice(1);
  const toKebabCase = (str) =>
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
          path="/category/:categoryName/:categoryId"
          element={
            <ContentList addToCart={addToCart} toKebabCase={toKebabCase} />
          }
        />
        <Route
          path="/category/:categoryName/:categoryIdproduct/:productId"
          element={
            <ProductGallery addToCart={addToCart} toKebabCase={toKebabCase} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
