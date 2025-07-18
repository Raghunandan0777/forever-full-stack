import dotenv from 'dotenv';
dotenv.config();

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);
import express from "express"
import cors from "cors"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";






// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// widdlewares


app.use(cors())
// app.use(cors({
//   const cors = require("cors");
//   origin: "https://forever-full-stack-iyas.onrender.com", "https://forever-full-stack-admin-cl0w.onrender.com",// allow frontend
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"], // <-- this is important
// }));

  

// api endpoint

app.use("/api/user", userRoute)
app.use("/api/product",productRouter)
app.use('/api/order', orderRouter)
app.use("/api/cart", cartRouter)




app.listen(port, () => console.log("server is started on PORT : " + port)
)
