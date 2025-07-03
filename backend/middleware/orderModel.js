import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    images: { type: Array, required: true }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type:String,
        require:true
    },
     items: [orderItemSchema],
     amount: {
        type:Number,
        require:true
    },
     address: {
        type:Object,
        require:true
    },
     status: {
        type:String,
        require:true,
        default:"Order Placed"
    },
     paymentMethod: {
        type:String,
        require:true
    },
     payment: {
        type:Boolean,
        require:true,
        default: false
    },
     Date: {
        type:Number,
        require:true
    }
})

const orderModel= mongoose.models.order || mongoose.model("order",orderSchema)
export default orderModel