import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Try to load cart from localStorage if no token
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {};
  });
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ------------------add to cart logic----------

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          "https://forever-backend-svm0.onrender.com" + "/api/cart/add",
          { itemId, size },
          { headers: {
      Authorization: `Bearer ${token}`,
    },}
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      const sizes = cartItems[itemId];
      for (const size in sizes) {
        if (sizes[size]) {
          totalCount += sizes[size];
        }
      }
    }
    return totalCount;
  };

  //   {------------- delete cart item logic--------}

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          "https://forever-backend-svm0.onrender.com" + "/api/cart/update",
          { itemId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // { cart total}

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((products) => products._id === items);
      if (!itemInfo) continue; // Skip if product not found
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  //    ...............product deta........

  const getProductsData = async () => {
    try {
      const response = await axios.get("https://forever-backend-svm0.onrender.com" + "/api/product/list");
      console.log(response.data.products);

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);


  // logic to get the data from db  if user refresh the page
  const getUserCart = async (token) => {
     console.log("🛒 Fetching cart with token:", token);
    try {
      const response = await axios.post(
        "https://forever-backend-svm0.onrender.com" + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
        console.log('🛒 Cart items after fetch:', response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  
  useEffect(() => {
  const localToken = localStorage.getItem("token");
  if (localToken) {
    setToken(localToken);
  }
}, []);
  

   useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token])

  // Save cartItems to localStorage for guests (no token)
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // Function to clear the cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    loadingProducts,
    clearCart,
    getUserCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
