import express from "express";
import cartController from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const { addToCart, updateCart, getUserCart } = cartController;
const cartRouter = express.Router();

// Correct and unique routes
cartRouter.post("/add", authUser, addToCart);       // Add to cart
cartRouter.post("/update", authUser, updateCart);   // Update cart
cartRouter.post("/get", authUser, getUserCart);     // Get cart
cartRouter.post("/clear", authUser, cartController.clearCart); // Clear cart

export default cartRouter;
