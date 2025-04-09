import "../../assets/index.css";
import logo from "../../assets/logo.png";
import cart from "../../assets/cart.png";
import CartExpand from "./CartExpand.tsx";
import { useState, useEffect } from "react";
import { CartItem } from "../../types";
import { NavLink } from "react-router-dom";

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

type HeaderProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  increaseQuantity: (productId: number, selectedAttributes: any) => void;
  decreaseQuantity: (productId: number, selectedAttributes: any) => void;
  toKebabCase: (str: string) => string;
};

function Header({
  cartItems,
  setCartItems,
  increaseQuantity,
  decreaseQuantity,
  toKebabCase,
}: HeaderProps) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const query = {
        query: `
                {
                    categories {
                        id
                        name
                    }
                }`,
      };

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        });

        const jsonResponse = await response.json();

        if (jsonResponse.data && jsonResponse.data.categories) {
          setCategories(jsonResponse.data.categories);
        } else {
          console.error("GraphQL Error:", jsonResponse.errors);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getTotalQuantity = (cartItems: any) =>
    cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0);

  return (
    <div className="header">
      <div className="navigation">
        <div className="navItem">
          {/* {categoryId} {categoryName} */}
          {categories.map((category: any) => (
            <NavLink
              to={`/${category.name}/${category.id}`}
              id={category.id}
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "navItemLabel active-link" : "navItemLabel"
              }
              data-testid={({ isActive }: { isActive: boolean }) =>
                isActive ? "active-category-link" : "category-link"
              }
            >
              {category.name}
            </NavLink>
          ))}
        </div>
        <div className="navLogo">
          <img src={logo} alt="logo" />
        </div>
        <button
          className="cartWrap"
          onClick={() => setOpen(!open)}
          data-testid="cart-btn"
          aria-label="Open cart"
        >
          <img src={cart} alt="cart" />
          {cartItems.length ? (
            <span className="cartQty">{getTotalQuantity(cartItems)}</span>
          ) : (
            ""
          )}
        </button>
      </div>
      {open && cartItems.length != null && (
        <CartExpand
          cartItems={cartItems}
          setCartItems={setCartItems}
          getTotalQuantity={getTotalQuantity}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          toKebabCase={toKebabCase}
        />
      )}
      {open && cartItems.length != null && (
        <div className="contentOverlay"></div>
      )}
    </div>
  );
}

export default Header;
