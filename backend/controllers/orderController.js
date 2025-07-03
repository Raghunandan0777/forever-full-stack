import orderModel from "../middleware/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe';
import Razorpay from "razorpay"
import crypto from "crypto";

// gateway intialization
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log("Stripe key from env:", process.env.STRIPE_SECRET_KEY);

// global variable 
const currency = "USD"
const deliveryCharge = 10

// placing order using COD
const placingOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "No items to order." });
    }

    const orderData = {
      userId,
      amount,
      items,
      address,
      paymentMethod: "COD",
      payment: true,
      Date: Date.now()
    }
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, { cartData: {} })
    res.json({ success: true, message: "Order Placed" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// Placing order using Stripe Method
console.log("stripe key",process.env.STRIPE_SECRET_KEY );

const placingOrderStripe = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { amount, items, address } = req.body;
    const userId = req.userId;
    console.log('User ID in placingOrderStripe:', userId);
    const origin = req.headers.origin || "http://localhost:5173"; 

    const currency = "usd";
    const deliveryCharge = 100;

    const orderData = {
      userId,
      amount,
      items,
      address,
      paymentMethod: "Stripe",
      payment: false,
      Date: Date.now()
    };

    const newOrder = await new orderModel(orderData).save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity || 1
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1
    });

    console.log("Line items sent to Stripe:", line_items);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment"
    });
    console.log("Stripe session created:", session.url);


    res.json({ success: true, success_url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Placing order using Razorpay Method
const placingOrderRazorpay = async (req, res) => {
  try {
    const { amount, items, address } = req.body;
    const userId = req.userId;

    
    const newOrder = new orderModel({
      userId,
      amount,
      items,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      Date: Date.now(),
    });
    await newOrder.save();

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order, orderId: newOrder._id });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Error creating Razorpay order" });
  }
};


// all order using Admin Panel 
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// user order data from frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Updating status using Admin Panel 
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// verify Stripe
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (success) {
      const order = await orderModel.findByIdAndUpdate(orderId, { payment: true });
      console.log("Order found in verifyStripe:", order);
      if (order && order.userId) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
        console.log("Cleared cart for user:", order.userId);
      } else {
        console.log("No userId found for order:", orderId);
      }
      return res.json({ success: true, message: "Payment Successful" });
    }
    res.json({ success: false, message: "Payment Failed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment details" });
    }

    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed: Invalid signature" });
    }
    
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    const localOrderId = razorpayOrder.receipt;

    const order = await orderModel.findByIdAndUpdate(localOrderId, { payment: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found in our system" });
    }
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    res.json({ success: true, message: "Payment successful and verified" });

  } catch (error) {
    console.error("Error in Razorpay verification:", error);
    res.status(500).json({ success: false, message: "Server error during payment verification" });
  }
};


export {
  placingOrder,
  placingOrderStripe,
  placingOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
};