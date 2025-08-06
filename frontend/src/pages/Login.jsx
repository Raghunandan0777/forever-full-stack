import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState({ name: false, email: false, password: false });;

  const validateForm = () => {
    const newErrors = {};

    if (currentState === "Sign Up" && !name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const formData = currentState === "Sign Up" 
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(
        backendUrl + 
          (currentState === "Sign Up" ? "/api/user/register" : "/api/user/login"),
        formData
      );

      if (response.data.success) {
        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          navigate("/");
          toast.success(response.data.message || "Success!");
          // Reset form fields
          setName("");
          setEmail("");
          setPassword("");
        } else {
          throw new Error("Token not received from server");
        }
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      onSubmitHandler(e);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4"
    >
      <motion.form
        onSubmit={onSubmitHandler}
        onKeyDown={handleKeyDown}
        variants={itemVariants}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            {currentState}
          </motion.h1>
          <motion.hr 
            variants={{
              hidden: { width: 0 },
              visible: { width: "80px" }
            }}
            className="border-2 border-black mx-auto"
          />
        </motion.div>

        {currentState === "Sign Up" && (
          <motion.div 
            variants={itemVariants}
            className="mb-4"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Full Name"
              required
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={itemVariants}
          className="mb-4"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="Email Address"
            required
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mb-6"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            required
          />
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex justify-between text-sm text-gray-600"
        >
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer hover:text-blue-500 transition-colors"
          >
            Forgot Password?
          </motion.p>
          <motion.p 
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentState(prev => prev === "Login" ? "Sign Up" : "Login")}
            className="cursor-pointer hover:text-blue-500 transition-colors"
          >
            {currentState === "Login" ? "Create Account" : "Login Here"}
          </motion.p>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          {loading ? (
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block"
            >
              Loading...
            </motion.div>
          ) : (
            currentState === "Login" ? "Sign In" : "Sign Up"
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Login;
