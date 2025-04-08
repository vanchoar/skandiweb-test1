import "../../assets/index.css";
import "../../assets/ProductGallery.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";

const GRAPHQL_ENDPOINT =
  "http://localhost/scandiweb-test1/backend/controllers/GraphQL.php";

function ProductGallery({ addToCart, toKebabCase }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const query = {
        query: `
          {
            product(productId: ${productId}) {
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
                  id
                  value
                  displayValue
                }
              }
            }
          }
        `,
      };

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });
        const jsonResponse = await response.json();
        if (jsonResponse.data && jsonResponse.data.product) {
          setProduct(jsonResponse.data.product);
          // setMainImg(data.product.gallery[0]?.image_url);
        } else {
          console.error("GraphQL Error:", jsonResponse.errors);
        }
        // Build default selected attributes from the first item of each attribute
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const images = product.gallery.map((g) => g.image_url);
  const currentImage = images[currentIndex];

  // setMainImg(product.gallery[0] || "");

  const defaultOptions = product.attributes.map((attr) => ({
    id: attr.id,
    name: attr.name,
    displayValue: attr.items[0]?.displayValue,
    value: attr.items[0]?.value, // First option in each attribute
  }));
  // setSelectedAttributes(defaultOptions);

  // const [selectedAttributes, setSelectedAttributes] = useState([]);

  const updateAttributes = (id, name, displayValue, value) => {
    setSelectedAttributes((prev) => {
      // Check if this attribute is already in the array
      const existingIndex = prev.findIndex((attr) => attr.id === id);

      // Build the new attribute object
      const newAttr = { id, name, displayValue, value };

      if (existingIndex !== -1) {
        // If it exists, replace it
        const copy = [...prev];
        copy[existingIndex] = newAttr;
        return copy;
      } else {
        // Otherwise, append it
        return [...prev, newAttr];
      }
    });
  };

  // console.log(defaultOptions);
  // console.log(selectedAttributes);

  return (
    <div className="content-main productView">
      <div className="galleryContainer">
        {/* Thumbnails column */}
        <div className="galleryThumbnails">
          {product.gallery.map((g, idx) => (
            <img
              key={idx}
              src={g.image_url}
              className={`thumbnail ${
                mainImg === g.image_url ? "selected" : ""
              }`}
              alt={`${product.name} thumb ${idx + 1}`}
              onClick={() => setMainImg(g.image_url)}
            />
          ))}
        </div>

        {/* Main image + arrows */}
        <div className="galleryMainImg" data-testid="product-gallery">
          <div className="MainImageWrap">
            {images.length > 1 ? (
              <div className="scrollArrows">
                <div
                  className="leftScroll"
                  onClick={() =>
                    setMainImg((prev) => {
                      const images = product.gallery.map((x) => x.image_url);
                      const i = images.indexOf(prev);
                      return images[(i - 1 + images.length) % images.length];
                    })
                  }
                >
                  &#8249;
                </div>
                <div
                  className="rightScroll"
                  onClick={() =>
                    setMainImg((prev) => {
                      const images = product.gallery.map((x) => x.image_url);
                      const i = images.indexOf(prev);
                      return images[(i + 1) % images.length];
                    })
                  }
                >
                  &#8250;
                </div>
              </div>
            ) : null}
            <img
              className="loadMainProduct"
              src={mainImg ? mainImg : currentImage}
              alt={product.name}
            />
          </div>
        </div>
      </div>
      <div className="galleryMainInfo">
        <h3>{product.name}</h3>
        <div className="infoElement">
          {product.attributes.map((attr) => (
            <div
              className="infoElement"
              key={attr.id}
              data-testid={`product-attribute-${toKebabCase(attr.name)}`}
            >
              <div className="infoTitle">{attr.name.toUpperCase()}</div>
              <div className="itemOptsWrap">
                {attr.items.map((item) => {
                  // Determine base class
                  const baseClass =
                    attr.name === "Color" ? "itemColor" : "itemBox";

                  // Check if selectedAttributes array contains this attribute with this value
                  const isSelected = selectedAttributes.some(
                    (sel) =>
                      sel.id === attr.id &&
                      sel.displayValue === item.displayValue
                  );

                  return (
                    <div
                      key={item.id}
                      className={`${baseClass}${isSelected ? " selected" : ""}`}
                      style={
                        attr.name === "Color"
                          ? { backgroundColor: item.value }
                          : undefined
                      }
                      data-id={item.id}
                      onClick={() =>
                        updateAttributes(
                          attr.id,
                          attr.name,
                          item.displayValue,
                          item.value
                        )
                      }
                    >
                      {attr.name == "Size" && item.value
                        ? item.value
                        : attr.name == "Color"
                        ? ""
                        : item.displayValue}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="infoElement">
          <div className="infoTitle">PRICE:</div>
          <div className="infoPrice">
            {product.price.currency_symbol} {product.price.amount}
          </div>
        </div>
        {product.inStock ? (
          <button
            className="orderBtn"
            data-testid="add-to-cart"
            onClick={() =>
              addToCart(
                product,
                selectedAttributes?.length > 0
                  ? selectedAttributes
                  : defaultOptions
              )
            }
          >
            ADD TO CART
          </button>
        ) : (
          <div>OUT OF STOCK</div>
        )}
        <div className="infoText" data-testid="product-description">
          {parse(product.description)}
        </div>
      </div>
    </div>
  );
}

export default ProductGallery;
