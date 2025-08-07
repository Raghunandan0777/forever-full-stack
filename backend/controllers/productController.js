import {v2 as cloudinary} from "cloudinary"
import { json } from "express";
import productModel from "../models/productModel.js"


// fun for add product
const addProduct = async (req, res) => {
    try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image"
                });
                return result.secure_url;
            })
        );

        // Parse sizes 
        console.log("Raw sizes input:", sizes);
        let parsedSizes = [];
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (e) {
            throw new Error("Invalid sizes JSON format");
        }
        

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: parsedSizes,
            images: imagesUrl,
            Date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// fun for list products
const listProducts = async(req,res)=>{
    try {
        console.log("Fetching products from database...");
        const products = await productModel.find({});
        console.log("Found products:", products.length);

        // If no products found, seed some sample data
        if (products.length === 0) {
            console.log("No products found, seeding sample data...");
            const sampleProducts = [
                {
                    name: "Sample Product 1",
                    description: "A sample product description",
                    price: 99.99,
                    category: "Electronics",
                    subCategory: "Mobile",
                    sizes: ["S", "M", "L"],
                    bestseller: true,
                    images: ["https://via.placeholder.com/400"]
                },
                {
                    name: "Sample Product 2",
                    description: "Another sample product",
                    price: 199.99,
                    category: "Electronics",
                    subCategory: "Laptop",
                    sizes: ["M", "L", "XL"],
                    bestseller: false,
                    images: ["https://via.placeholder.com/400"]
                }
            ];

            for (const product of sampleProducts) {
                await productModel.create(product);
            }
            console.log("Sample products seeded successfully");
        }

        res.json({success:true,products})
    } catch (error) {
         console.log("Error fetching products:", error);
         res.json({success:false, message: error.message})
    }
}

// fun for remove product
const removeProduct = async(req,res)=> {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"product is removed"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
        
        
    }

}

// fun for single product info
const singleProduct = async(req,res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
        
    }

}
 export {listProducts,removeProduct,addProduct,singleProduct};
