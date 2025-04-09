import "../../assets/index.css";
import { SelectedAttribute, Product } from "../../types";
import cart_btn from "../../assets/cart_btn.png";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type ContentListProps = {
  addToCart: (
    product: Product,
    selectedAttributes: SelectedAttribute[]
  ) => void;
  toKebabCase: (str: string) => string;
};

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

function ContentList({ addToCart, toKebabCase }: ContentListProps) {
  const [products, setProducts] = useState([]);
  const { categoryName, categoryId } = useParams();
  const navigate = useNavigate(); // Navigate on click

  useEffect(() => {
    const fetchProducts = async () => {
      const query = {
        query: `
          {
            productsByCategory(categoryId: ${categoryId}) {
              id
              name
              description
              inStock
              price {
                amount
                currency_symbol
              }
              gallery {
                image_url
              }
              attributes {
                id
                name
                items {
                  value
                  displayValue
                }
              }
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
        // console.log("GraphQL Response:", jsonResponse);

        if (jsonResponse.data && jsonResponse.data.productsByCategory) {
          setProducts(jsonResponse.data.productsByCategory);
        } else {
          console.error("GraphQL Error:", jsonResponse.errors);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId]);
  const capitalize = (str: any) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="contentWrap">
      <h2> {capitalize(categoryName)}</h2>

      <div className="items-list">
        {products.map((product: Product) => {
          const defaultOptions = (product as Product).attributes.map(
            (attr) => ({
              id: attr.id,
              name: attr.name,
              displayValue: attr.items[0]?.displayValue,
              value: attr.items[0]?.value,
            })
          );

          return (
            <div
              className="itemContent"
              data-testid={`product-${toKebabCase(product.name)}`}
            >
              <div
                className="itemWrap"
                key={product.id}
                onClick={() => navigate(`/${categoryId}/product/${product.id}`)}
              >
                <img
                  className={
                    product.inStock ? "productImage" : "productImage greyed"
                  }
                  src={product.gallery[0].image_url}
                  alt={product.name}
                />

                <h4 className="itemName">{product.name}</h4>
                <h4 className="itemPrice">
                  {product.price.currency_symbol}
                  {product.price.amount}
                </h4>
              </div>

              {product.inStock ? (
                <img
                  className="cartBtn"
                  onClick={() => addToCart(product, defaultOptions)}
                  src={cart_btn}
                  alt="cart button"
                  data-testid="cart-btn"
                />
              ) : (
                <div className="outOfStock">OUT OF STOCK</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContentList;
