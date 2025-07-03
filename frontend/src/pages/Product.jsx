import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [Size, setSize] = useState("");

  const fetchProductData = () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        const imgArr = item.images || [];
        setImage(
          imgArr[0]
            ? imgArr[0].startsWith("http")
              ? imgArr[0]
              : `${backendUrl}/uploads/${imgArr[0]}`
            : "/placeholder.jpg"
        );
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product img */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {(productData.Image || productData.image || []).map((img, index) => (
              <img
                onClick={() => setImage(
                  img.startsWith("http")
                    ? img
                    : `${backendUrl}/uploads/${img}`
                )}
                src={
                  img.startsWith("http")
                    ? img
                    : `${backendUrl}/uploads/${img}`
                }
                alt=""
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          {/* for  showing individual image */}
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image || "/placeholder.jpg"} alt="" />
          </div>
        </div>
        {/* product details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {" "}
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 : "" ${
                    item === Size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button onClick={() => addToCart(productData._id, Size)} className="bg-black text-white py-3 px-8 text-sm active:bg-gray-700">
              Add to Cart
            </button>
            <hr className="mt-8 sm: w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product</p>
              <p> Cash On Delivery is available on this product. </p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Description and review-section  */}
      <div className="mt-20">
        <div className="flex">
          <p className="border px-5 py-3 text-sm">Description</p>
          <p className="border px-5 py-3 text-sm">Reviews(122)</p>
        </div>
        <div className="flex flex-col gap-4 border  py-6 px-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Accusamus nulla tempora delectus molestiae voluptates beatae,
            voluptas impedit! Nisi deleniti quidem quasi, maiores accusamus
            eaque cupiditate recusandae cumque culpa doloremque maxime?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Accusamus nulla tempora delectus molestiae voluptates beatae,
            voluptas impedit! Nisi deleniti quidem quasi, maiores accusamus
            eaque cupiditate recusandae cumque culpa doloremque maxime?
          </p>
        </div>
      </div>

      {/* {-----------------related product section-------} */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
