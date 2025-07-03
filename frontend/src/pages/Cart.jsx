import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    backendUrl,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="bg-gray-50 min-h-screen border-t pt-14 pb-10">
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {cartData.length === 0 && (
          <div className="text-center text-gray-400 py-12 text-lg">Your cart is empty.</div>
        )}
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          if (!productData) return null;

          const imageUrl = productData.images?.[0]?.startsWith("http")
            ? productData.images[0]
            : `${backendUrl}/uploads/${productData.images?.[0]}`;

          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6 border border-gray-100 hover:shadow-2xl transition-shadow"
            >
              <img className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" src={imageUrl} alt="Product" />

              <div className="flex flex-col flex-1 w-full">
                <p className="text-lg font-semibold text-gray-800 mb-1">{productData.name}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <p className="font-medium">{currency}{productData.price}</p>
                  <p className="px-3 py-1 border bg-slate-50 rounded-full text-xs font-semibold">{item.size}</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs text-gray-500">Qty:</label>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border max-w-16 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="ml-2 p-2 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition"
                    title="Remove from cart"
                  >
                    <img
                      className="w-5 h-5"
                      src={assets.bin_icon}
                      alt="Delete"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-16 max-w-3xl mx-auto">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-blue-600 hover:bg-blue-700 text-white my-8 px-8 py-3 rounded-lg font-semibold shadow-md text-base transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
