import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  
  

  // Determine if we're in production or development
  const isProduction = window.location.hostname === 'vercel.app';
  
  const backendUrl = isProduction 
    ? 'https://forever-full-stack-backend-luux31c0y-raghunandan-shahs-projects.vercel.app'
    : 'http://localhost:4001';

  // Add API prefix to all endpoints
  const apiEndpoint = backendUrl + '/api';

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

    try {
      // First update local cart state
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

      // Then make API call to update backend cart
      const response = await axios.post(
        `${apiEndpoint}/cart/add`,
        { itemId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Added to Cart");
      } else {
        toast.error("Failed to add to cart");
      }

    } catch (error) {
      console.error("Cart add error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
      // If backend update fails, revert local state
      setCartItems(cartItems);
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
          `${apiEndpoint}/cart/update`,
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

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        console.log("Fetching products from:", `${apiEndpoint}/product/list`);
        const response = await axios.get(`${apiEndpoint}/product/list`);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 200 && response.data?.success) {
          const products = response.data.products || [];
          console.log("Received products:", products.length);
          setProducts(products);
        } else {
          console.error("Invalid response:", response.data);
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
  }, [apiEndpoint]);

  // Product fetching function
  const getProductsData = async () => {
    setLoadingProducts(true);
    try {
      console.log("Fetching products from:", `${apiEndpoint}/product/list`);
      const response = await axios.get(`${apiEndpoint}/product/list`);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200 && response.data?.success) {
        const products = response.data.products || [];
        console.log("Received products:", products.length);
        setProducts(products);
      } else {
        console.error("Invalid response:", response.data);
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // logic to get the data from db  if user refresh the page
  const getUserCart = async (token) => {
    console.log("🛒 Fetching cart with token:", token);
    try {
      const response = await axios.get(
        `${apiEndpoint}/cart`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
        console.log('🛒 Cart items after fetch:', response.data.cartData);
      } else {
        console.error("Invalid response:", response.data);
        toast.error("Failed to fetch cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.message || "Failed to fetch cart");
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
    getProductsData
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
