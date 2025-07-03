import userModel from "../models/userModel.js";

// Add product to user cart
const addToCart = async (req, res) => {
    try {
        console.log("REQ.BODY:", req.body);
        console.log("USER ID:", req.user.id);

        const { itemId, size } = req.body;
        const userId = req.user.id;

        const userData = await userModel.findById(userId);


        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        } else {
            cartData[itemId][size] = 1;
        }


        const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        console.log("Updated cartData:", updatedUser.cartData);

        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update the user cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.id; 

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Failed to fetch user cart:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear user cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { addToCart, updateCart, getUserCart, clearCart };
