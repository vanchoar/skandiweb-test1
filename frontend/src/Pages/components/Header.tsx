import "../../assets/index.css";
import logo from "../../assets/logo.png";
import cart from "../../assets/cart.png";
import CartExpand from "./CartExpand.tsx";
import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";

const GRAPHQL_ENDPOINT =
  "http://localhost/scandiweb-test1/backend/controllers/GraphQL.php";

function Header({
  cartItems,
  setCartItems,
  increaseQuantity,
  decreaseQuantity,
  toKebabCase,
}) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const { categoryName, categoryId } = useParams();
  // const [cartItems, setCartItems] = useState<number>(0);

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

  const getTotalQuantity = (cartItems) =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="header">
      <div className="navigation">
        <div className="navItem">
          {/* {categoryId} {categoryName} */}
          {categories.map((category: any) => (
            <NavLink
              to={`/category/${category.name}/${category.id}`}
              id={category.id}
              // className={({ isActive }) =>
              //   isActive ? "navItemLabel active-link" : "navItemLabel"
              // }
            >
              {/* {category.name} */}
              {({ isActive }) => (
                <span
                  className={
                    isActive ? "navItemLabel active-link" : "navItemLabel"
                  }
                  data-testid={
                    isActive ? "active-category-link" : "category-link"
                  }
                >
                  {category.name}
                </span>
              )}
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
          aria-label
        >
          <img src={cart} alt="cart" />
          {cartItems.length ? (
            <span className="cartQty">{getTotalQuantity(cartItems)}</span>
          ) : (
            ""
          )}
        </button>
      </div>
      {open && cartItems.length != "" && (
        <CartExpand
          cartItems={cartItems}
          setCartItems={setCartItems}
          getTotalQuantity={getTotalQuantity}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          toKebabCase={toKebabCase}
        />
      )}
      {open && cartItems.length != "" && <div className="contentOverlay"></div>}
    </div>
  );
}

export default Header;
