import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add.jsx"
import { Form } from "react-router-dom";
import Login from "./components/Login";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { ToastContainer } from 'react-toastify';
import { Navigate } from "react-router-dom";



export const currency = '$';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;


function App() {
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token"): "");


  useEffect(() => {
    localStorage.setItem("token",token)
  
  },[token])

  return (
    <div className="bg-white min-h-screen">
      <ToastContainer/>
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full bg-white">
            <Sidebar />
            <div className="w-full ml-[max(5vw, 15px)] text-gray-800 text-base bg-white">
              <Routes>
                <Route path="/" element={<Navigate to="/add" />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token}  />} />
                <Route path="/orders" element={<Orders token={token}  />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default App;
