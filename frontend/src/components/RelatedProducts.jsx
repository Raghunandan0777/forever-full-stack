import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subcategory, productId }) => {
  const { products, backendUrl } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  // Helper function to get image URL
  const getImageUrl = (product) => {
    const imgArr = product.Image || product.image || product.images || [];
    const imageUrl = imgArr?.[0]
      ? imgArr[0].startsWith("http")
        ? imgArr[0]
        : `${backendUrl}/uploads/${imgArr[0]}`
      : "/placeholder.jpg";
    return imageUrl;
  };

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      // Filter products by category and subcategory
      const filteredProducts = products.filter((item) => 
        item.category === category && item.subCategory === subcategory
      );

      // Get unique products (remove duplicates)
      const uniqueProducts = Array.from(new Map(filteredProducts.map(item => 
        [item._id, item]
      )).values());

      // Remove the current product from the list
      const relatedProducts = uniqueProducts.filter(product => product._id !== productId);

      setRelated(relatedProducts.slice(0, 5));
    }
  }, [products, category, subcategory, productId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.length > 0 ? (
          related.map((product, index) => (
            <ProductItem
              key={product._id}
              product={product}
              imageUrl={getImageUrl(product)}
              errorFallback={() => "/placeholder.jpg"}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No related products available</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
