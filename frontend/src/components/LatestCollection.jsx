import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products, backendUrl, loadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products, loadingProducts]);

  if (loadingProducts) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, quos
          iste eveniet blanditiis
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {Array.isArray(latestProducts) && latestProducts.length > 0 ? (
          latestProducts.map((item, index) => {
            const imgArr = item.images;
            const imageUrl = imgArr?.[0]
              ? imgArr[0].startsWith("http")
                ? imgArr[0]
                : `${backendUrl}/uploads/${imgArr[0]}`
              : "/placeholder.jpg";

            return (
              <ProductItem
                key={index}
                product={item}
                imageUrl={imageUrl}
                errorFallback={() => "/placeholder.jpg"}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
