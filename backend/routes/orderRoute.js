import express from "express"

import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

import {
  placingOrder,
  placingOrderStripe,
  placingOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
} from "../controllers/orderController.js";

const orderRouter = express.Router()
// Admin Feature
orderRouter.post("/list",adminAuth, allOrders)
orderRouter.post("/status",adminAuth, updateStatus)


//Payment Method
orderRouter.post("/place",authUser, placingOrder)
orderRouter.post("/stripe",authUser, placingOrderStripe)
orderRouter.post("/razorpay",authUser, placingOrderRazorpay)

// user feature
orderRouter.post("/userorders",authUser, userOrders)

// verify Payment
orderRouter.post("/verifyStripe",authUser,verifyStripe)
orderRouter.post("/verifyRazorpay",authUser,verifyRazorpay)

export default orderRouter

