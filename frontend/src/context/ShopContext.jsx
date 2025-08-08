import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  // Correct environment variable usage
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
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

  // ------------------ Add to cart ------------------
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    try {
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

      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Added to Cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart add error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
      setCartItems(cartItems); // revert
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      const sizes = cartItems[itemId];
      for (const size in sizes) {
        if (sizes[size]) totalCount += sizes[size];
      }
    }
    return totalCount;
  };

  // ------------------ Update cart quantity ------------------
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // ------------------ Get cart amount ------------------
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((products) => products._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  // ------------------ Fetch products ------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.status === 200 && response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  const getProductsData = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.status === 200 && response.data?.success) {
        setProducts(response.data.products || []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // ------------------ Fetch user cart ------------------
  const getUserCart = async (token) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error("Failed to fetch cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.message || "Failed to fetch cart");
    }
  };

  // ------------------ Token load ------------------
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
  }, [token]);

  // ------------------ Save guest cart to localStorage ------------------
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // ------------------ Clear cart ------------------
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
    getProductsData
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
