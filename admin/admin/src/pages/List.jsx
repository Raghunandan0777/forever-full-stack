import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

function List() {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-4xl mx-auto items-center justify-center md:px-8">
          <p className="mb-6 text-2xl font-bold text-center text-gray-800 tracking-tight">
            All Products List
          </p>
          <div className="flex flex-col gap-6">
            {list.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No products found.
              </div>
            )}
            {list.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <img
                    src={
                      item.images?.[0]?.startsWith("http")
                        ? item.images[0]
                        : `${backendUrl}/uploads/${
                            item.images?.[0] || "placeholder.jpg"
                          }`
                    }
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />

                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Category: {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-1/2 justify-between">
                  <span className="text-xl font-bold text-green-600">
                    {currency}
                    {item.price}
                  </span>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md transition-colors text-lg"
                    title="Remove product"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="ml-2 hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default List;
