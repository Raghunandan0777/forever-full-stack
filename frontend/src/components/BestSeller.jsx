import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

function BestSeller() {
  const { products, backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
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
        {bestSeller.map((item, index) => {
          const imgArr = item.images;
          const imageUrl = imgArr?.[0]
            ? imgArr[0].startsWith('http')
              ? imgArr[0]
              : `${backendUrl}/uploads/${imgArr[0]}`
            : '/placeholder.jpg';

          return (
            <ProductItem
              key={index}
              id={item._id}
              image={imageUrl}
              name={item.name}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BestSeller;
