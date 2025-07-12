import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "../api/axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

function Add({ token }) {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("topweare");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("Sending token:", token);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("")
      }
      else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 flex flex-col gap-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center tracking-tight">Add New Product</h2>
        {/* Upload Image */}
        <div>
          <p className="mb-2 font-semibold text-lg">Upload Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4].map((num) => (
              <label
                key={num}
                htmlFor={`image${num}`}
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:border-blue-500 transition group bg-gray-50"
              >
                <img
                  src={!eval(`image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))}
                  alt="upload"
                  className="w-20 h-20 opacity-70 group-hover:scale-105 transition-transform"
                />
                <input
                  onChange={(e) => eval(`setImage${num}`)(e.target.files[0])}
                  type="file"
                  id={`image${num}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type here"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block mb-1 font-medium">Product description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
            className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write content here"
          />
        </div>

        {/* Product Category, Subcategory, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Product category</label>
            <select required
              onChange={(e) => setCategory(e.target.value) }
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Women</option>
              <option>Men</option>
              <option>Kids</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Sub category</label>
            <select required
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Product Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="25"
            />
          </div>
        </div>

        {/* Product Sizes */}
        <div>
          <p className="mb-2 font-medium">Product Sizes</p>
          <div className="flex gap-3 flex-wrap">
            {["S","M","L","XL","XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
              >
                <p
                  className={`px-4 py-1 rounded-full border cursor-pointer transition font-semibold text-sm
                    ${sizes.includes(size)
                      ? "bg-blue-100 border-blue-400 text-blue-700 shadow"
                      : "bg-slate-100 border-gray-300 text-gray-500 hover:bg-blue-50"}
                  `}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className="flex items-center gap-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="accent-blue-600 w-4 h-4"
          />
          <label htmlFor="bestseller" className="font-medium">Add to bestseller</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-lg font-semibold shadow-md transition w-fit mx-auto text-lg"
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default Add;
