import express from "express"
import {listProducts,removeProduct,addProduct,singleProduct} from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js"

// Logging middleware
const logRequest = (req, res, next) => {
    console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);
    next();
};

const productRouter  = express.Router();

// Apply logging middleware to all routes
productRouter.use(logRequest);

productRouter.post('/add',adminAuth,upload.fields([{name: "image1", maxCount:1},{name: "image2", maxCount:1},{name: "image3", maxCount:1},{name: "image4", maxCount:1}]), addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);

// Add response logging
productRouter.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(body) {
        console.log("Response Body:", body);
        originalSend.apply(res, arguments);
    };
    next();
});

export default productRouter;