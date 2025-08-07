import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

function BestSeller() {
  const { products, backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  // Helper function to get image URL
  const getImageUrl = (product) => {
    const imgArr = product.images || product.Image || product.image || [];
    const imageUrl = imgArr?.[0]
      ? imgArr[0].startsWith('http')
        ? imgArr[0]
        : `${backendUrl}/uploads/${imgArr[0]}`
      : '/placeholder.jpg';
    return imageUrl;
  };

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller === true);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLER" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, quos iste eveniet blanditiis.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((product, index) => (
            <ProductItem
              key={product._id}
              product={product}
              imageUrl={getImageUrl(product)}
              errorFallback={() => '/placeholder.jpg'}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No bestseller products available</p>
        )}
      </div>
    </div>
  );
}

export default BestSeller;
