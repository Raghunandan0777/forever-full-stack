import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "../api/axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async (showToast = false) => {
    try {
      setLoading(true);
      if (!token) {
        console.log("No token found. User might not be logged in.");
        setLoading(false);
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API response:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              item["status"] = order.status;
              item["payment"] = order.payment;
              item["paymentMethod"] = order.paymentMethod;
              item["date"] = order.date || order.Date;
              allOrdersItem.push(item);
            });
          } else {
            console.log("Order missing 'items' array:", order);
          }
        });
        console.log("Processed orders:", allOrdersItem);
        setOrderData(allOrdersItem.reverse());
        if (showToast) {
          toast.success("Order status refreshed successfully.");
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error loading order data:", error);
      if (showToast) {
        toast.error("Failed to refresh order status.");
      }
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getImageSrc = (item) => {
    const img = item.images;
    let path = null;
    if (Array.isArray(img) && img[0]) {
      path = img[0];
    } else if (typeof img === "string" && img) {
      path = img;
    }
    if (path) {
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }
      return backendUrl + "/" + path;
    }
    return "https://via.placeholder.com/80";
  };


  const statusSteps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];
  const statusColors = {
    "Order Placed": "bg-blue-500",
    Packing: "bg-yellow-500",
    Shipped: "bg-purple-500",
    "Out for delivery": "bg-orange-500",
    Delivered: "bg-green-600",
  };

  function StatusBadge({ status }) {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
          statusColors[status] || "bg-gray-400"
        }`}
      >
        {status}
      </span>
    );
  }

  function StatusStepper({ status }) {
    const currentStep = statusSteps.indexOf(status);
    return (
      <div className="flex items-center w-full max-w-xl mx-auto mt-2 mb-4">
        {statusSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
              ${
                idx <= currentStep
                  ? statusColors[step]
                  : "bg-gray-300 text-gray-500"
              }
            `}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-1 text-xs ${
                  idx <= currentStep
                    ? "text-gray-800 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < statusSteps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 ${
                  idx < currentStep
                    ? statusColors[statusSteps[idx + 1]]
                    : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t pt-16 bg-gray-50 min-h-screen pb-10">
      <ToastContainer />
      <div className="text-xl sm:text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : orderData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No orders found.</div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-gray-100 hover:shadow-2xl transition-shadow"
            >
              <div className="flex gap-4 items-center w-full md:w-1/2">
                <img
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                  src={getImageSrc(item)}
                  alt={item.name}
                />
                <div className="flex flex-col justify-between text-sm sm:text-base">
                  <p className="font-semibold text-lg text-gray-800">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1 text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>

                  <p
                    className={`text-sm font-semibold ${
                      item.payment ? "text-green-600" : "text-red-500"
                    }`}
                  >
                     {item.payment ? "Paid" : "Pending"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 inline-block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(item.date).toDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-1/2">
                <div className="mb-2">
                  <StatusBadge status={item.status} />
                </div>
                <StatusStepper status={item.status} />
                <button
                  onClick={() => loadOrderData(true)}
                  className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
