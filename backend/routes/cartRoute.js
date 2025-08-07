import express from "express";
import cartController from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const { addToCart, updateCart, getUserCart } = cartController;
const cartRouter = express.Router();

// Cart routes
// GET /api/cart - Get cart items
// POST /api/cart/add - Add to cart
// POST /api/cart/update - Update cart
// POST /api/cart/clear - Clear cart
cartRouter.get("/", authUser, getUserCart);     // Get cart
cartRouter.post("/add", authUser, addToCart);   // Add to cart
cartRouter.post("/update", authUser, updateCart); // Update cart
cartRouter.post("/clear", authUser, cartController.clearCart); // Clear cart

export default cartRouter;
