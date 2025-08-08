import dotenv from 'dotenv';
dotenv.config();

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

import express from "express";
import cors from "cors";
import serverless from "serverless-http"; 
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Connect to services
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5177",
    "http://localhost:5176",
    "https://forever-frontend-blue-zeta.vercel.app",
    "https://forever-admin-seven-tau.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Forever Backend API is running',
    version: '1.0.0',
    endpoints: {
      user: '/api/user/*',
      product: '/api/product/*',
      order: '/api/order/*',
      cart: '/api/cart/*'
    }
  });
});

// API routes
app.use("/api/user", userRoute);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});


export const handler = serverless(app);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log("Server is started on PORT : " + port));
}
