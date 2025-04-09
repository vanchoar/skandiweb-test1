import "../../assets/index.css";
import { CartExpandProps } from "../../types";
import { useEffect, useState } from "react";

function CartExpand({
  cartItems,
  setCartItems,
  getTotalQuantity,
  increaseQuantity,
  decreaseQuantity,
  toKebabCase,
}: CartExpandProps) {
  const [attributesValues, setAttributesValues] = useState<any>([]);

  const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

  useEffect(() => {
    const fetchAttributes = async () => {
      const query = {
        query: `
      {
        attributesValues {
          id
          name
          items {
            id
            value
            displayValue
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
        // console.log(jsonResponse);
        if (jsonResponse.data && jsonResponse.data.attributesValues) {
          setAttributesValues(jsonResponse.data.attributesValues);
        } else {
          console.error("GraphQL Error:", jsonResponse.errors);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAttributes();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  );

  const placeOrder = async (cartItems: any[]) => {
    const transformedCartItems = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: {
        amount: item.price.amount,
        currency_symbol: item.price.currency_symbol,
      },
      gallery: item.gallery.map((img: any) => ({ image_url: img.image_url })),
      attributes: item.attributes.map((attr: any) => ({
        name: attr.name,
        value: attr.displayValue,
      })),
      quantity: item.quantity,
    }));

    const query = {
      query: `
        mutation PlaceOrder($cartItems: [OrderItemInput!]!) {
          placeOrder(cartItems: $cartItems)
        }
      `,
      variables: { cartItems: transformedCartItems },
    };

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const jsonResponse = await response.json();
      if (jsonResponse.data && jsonResponse.data.placeOrder) {
        setCartItems([]); // Clear cart using the parent setter
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  let totalItemsText = "";
  const totalItems = getTotalQuantity(cartItems);
  totalItems == 1
    ? (totalItemsText = totalItems + " item")
    : (totalItemsText = totalItems + " items");

  return (
    <div className="cartExpand">
      <div className="cartHeader">
        <span className="bold">My Bag.</span>{" "}
        <span data-testid="cart-item-amount"> {totalItemsText} </span>
      </div>
      {cartItems.map((cartItem) => (
        <div className="cartItemContent">
          <div className="leftColumn">
            <div className="cartContent">
              <div className="itemName">{cartItem.name}</div>
              {/* <div className="itemBox">+</div> */}
              <div className="itemPrice">
                {cartItem.price.currency_symbol}
                {cartItem.price.amount}
              </div>
              {cartItem.attributes.map((attr) => (
                <>
                  <div
                    className="itemOpts"
                    data-testid={`cart-item-attribute-${toKebabCase(
                      attr.name
                    )}`}
                  >
                    {attr.name}
                  </div>
                  {attr.name === "Size" ? (
                    <div className="itemOptsWrap">
                      {(
                        attributesValues.find(
                          (av: any) => av.name === attr.name
                        )?.items || []
                      ).map(
                        (item: any) => (
                          // item.value && (
                          <div
                            style={
                              item.value != attr.value
                                ? { display: "none" }
                                : undefined
                            }
                            key={item.id}
                            className={`itemBox${
                              // item.value === attr.value ? " selected" : ""
                              item.displayValue === attr.displayValue
                                ? " selected"
                                : ""
                            }`}
                            data-testid={`cart-item-attribute-${toKebabCase(
                              attr.name
                            )}-${toKebabCase(item.displayValue)}${
                              item.displayValue === attr.displayValue
                                ? " selected"
                                : ""
                            }`}
                          >
                            {item.value ? item.value : item.displayValue}
                          </div>
                        )
                        // )
                      )}
                    </div>
                  ) : attr.name == "Color" ? (
                    <div className="itemOptsWrap">
                      {(
                        attributesValues.find(
                          (av: any) => av.name === attr.name
                        )?.items || []
                      ).map(
                        (item: any) =>
                          item.value && (
                            <div
                              key={item.id}
                              className={`itemColor${
                                item.value === attr.value ? " selected" : ""
                              }`}
                              data-testid={`cart-item-attribute-${toKebabCase(
                                attr.name
                              )}-${toKebabCase(item.displayValue)}${
                                item.value === attr.value ? "-selected" : ""
                              }`}
                              style={{ backgroundColor: item.value }}
                            />
                          )
                      )}
                    </div>
                  ) : (
                    <div className="itemOptsWrap">
                      <div
                        data-testid={`cart-item-attribute-${toKebabCase(
                          attr.name
                        )}-${toKebabCase(attr.displayValue)}`}
                      >
                        {attr.displayValue}
                      </div>
                    </div>
                    // ""
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="midColumn">
            <button
              className="itemBox qtyInc"
              data-testid="cart-item-amount-increase"
              onClick={() => increaseQuantity(cartItem.id, cartItem.attributes)}
            >
              +
            </button>

            <div className="itemQty qtyNum">{cartItem.quantity}</div>
            <div
              className="itemBox qtyDec decrease"
              data-testid="cart-item-amount-decrease"
              onClick={() => decreaseQuantity(cartItem.id, cartItem.attributes)}
            >
              -
            </div>
          </div>
          <div className="rightColumn">
            <img
              className="cartItemImg"
              src={cartItem.gallery[0].image_url}
              alt="item"
            />
          </div>
        </div>
      ))}
      {cartItems.length > 0 ? (
        <>
          <div className="totalContent">
            <div className="totalText">Total</div>
            <div className="totalPrice" data-testid="cart-total">
              {cartItems.length > 0 ? cartItems[0].price.currency_symbol : "$"}
              {totalPrice.toFixed(2)}
            </div>
          </div>
          <button className="orderBtn" onClick={() => placeOrder(cartItems)}>
            PLACE ORDER
          </button>
        </>
      ) : null}
    </div>
  );
}

export default CartExpand;
