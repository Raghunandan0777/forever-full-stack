import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import assets from "../assets/assets";

function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("Please login as admin to view orders");
      return;
    }
    
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse() || []);
      } else if (response.data.message === "Unauthorized") {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        window.location.href = "/";
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        toast.error("Unauthorized access. Please login as admin.");
        window.location.href = "/";
      } else {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const statusHandler = async(event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(response.data.success){
        await fetchAllOrders()
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
       
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Status helpers
  const statusSteps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];
  const statusColors = {
    "Order Placed": "bg-blue-500",
    "Packing": "bg-yellow-500",
    "Shipped": "bg-purple-500",
    "Out for delivery": "bg-orange-500",
    "Delivered": "bg-green-600"
  };

  function StatusBadge({ status }) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[status] || "bg-gray-400"}`}>{status}</span>
    );
  }

  function StatusStepper({ status }) {
    const currentStep = statusSteps.indexOf(status);
    return (
      <div className="flex items-center w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto mt-2 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        {statusSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center min-w-[70px]">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${idx <= currentStep ? statusColors[step] : "bg-gray-300 text-gray-500"}
              `}>
                {idx + 1}
              </div>
              <span className={`mt-1 text-[10px] sm:text-xs text-center break-words leading-tight ${idx <= currentStep ? "text-gray-800 font-semibold" : "text-gray-400"}`}>{step}</span>
            </div>
            {idx < statusSteps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 ${idx < currentStep ? statusColors[statusSteps[idx+1]] : "bg-gray-200"}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <h3 className="pt-8 text-center text-2xl font-bold text-gray-800 mb-6 tracking-tight">Admin Orders</h3>
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {orders.length === 0 && <p className="text-center text-gray-500">No orders found.</p>}
        {orders.map((order, index) => (
          <div
            className="bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-gray-100 hover:shadow-2xl transition-shadow"
            key={order._id || index}
          >
            {/* Parcel Icon */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <img className="w-14 h-14 object-contain" src={assets.parcel_icon} alt="parcel icon" />
              <StatusBadge status={order.status} />
            </div>

            {/* Items and Name */}
            <div className="flex-grow text-sm text-gray-700 w-full md:w-1/3">
              <div className="mb-2">
                {Array.isArray(order.items) &&
                  order.items.map((item, index) => (
                    <div className="py-2 border-b border-gray-100 last:border-b-0" key={index}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full font-medium">× {item.quantity}</span>
                        </div>
                        <span className="text-gray-500">₹{item.price}</span>
                      </div>
                      <p className="text-medium text-gray-500 mt-1">{item.description}</p>
                      <p className="text-medium text-gray-500 mt-1">Size: <span className="font-medium">{item.size}</span></p>
                    </div>
                  ))}
              </div>
              <p className="mt-2 font-semibold text-gray-900 flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {order?.address?.firstName} {order?.address?.lastName}
              </p>
            </div>

            {/* Address */}
            <div className="text-sm text-gray-700 w-full md:w-1/4">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /></svg>
                <span>{order?.address?.street}, {order?.address?.city}, {order?.address?.state}, {order?.address?.country}, {order?.address?.zipcode}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" /></svg>
                <span>{order?.address?.phone}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="text-sm text-gray-700 w-full md:w-1/6 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                <span>{currency}{order.amount}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2" /></svg>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <p
                    className={`text-sm font-semibold ${
                      order.payment ? "text-green-600" : "text-red-500"
                    }`}
                  >
                     {order.payment ? "Paid" : "Pending"}
                  </p>

              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{order.Date ? new Date(order.Date).toLocaleDateString() : 'Invalid date'}</span>
              </div>
            </div>

            {/* Status Stepper & Dropdown */}
            <div className="flex flex-col items-end gap-2 w-full md:w-1/6">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="px-3 py-2 border-2 border-blue-200 rounded-lg font-medium text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
