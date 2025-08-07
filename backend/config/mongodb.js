import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure code
    }

    // Add connection event handlers
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
    });
}

export default connectDB;