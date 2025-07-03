import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products, backendUrl,loadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  
 

  // Removed imageUrl from here, will define inside map callback
  console.log("Latest products:", latestProducts);



 useEffect(() => {
  if (  Array.isArray(products) && products.length > 0) {
    setLatestProducts(products.slice(0, 10));
  }
}, [products, loadingProducts]);


if (loadingProducts) {
  return <div className="text-center py-10">Loading latest products...</div>;
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
      {/* {product rendring} */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {Array.isArray(latestProducts) && latestProducts.length > 0 &&
          latestProducts.map((item, index) => {
            // Check for 'images' key
            const imgArr = item.images;
            const imageUrl = imgArr?.[0]
              ? imgArr[0].startsWith("http")
                ? imgArr[0]
                : `${backendUrl}/uploads/${imgArr[0]}`
              : "/placeholder.jpg";

            return (
              <ProductItem
                key={index}
                id={item._id}
                image={imageUrl}
                name={item.name}
                price={item.price}
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default LatestCollection;
