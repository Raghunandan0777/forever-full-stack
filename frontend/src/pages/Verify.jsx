import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Verify() {
  const navigate = useNavigate(); 
  const { token, backendUrl, getUserCart } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
  if (!token) return;

  console.log("🔼 Sending to backend:", { success, orderId });

  try {
    const response = await axios.post(
      backendUrl + "/api/order/verifyStripe",
      { success, orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(" Response from backend:", response.data);

    if (response.data.success === true) {
      await getUserCart(token);
      navigate("/orders");
    } else {
      toast.error("Payment verification failed");
      navigate("/cart");
    }
  } catch (error) {
    console.error( error);
    toast.error(error?.response?.data?.message || "Something went wrong.");
  }
};


  useEffect(() => {
    
      verifyPayment();
    
  }, [token]);

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h2>Verifying your payment...</h2>
    </div>
  );
}

export default Verify;
