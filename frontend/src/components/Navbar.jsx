import React, { useState, useContext } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisiable] = useState(false);
  const { setShowSearch, getCartCount,token,setToken,navigate,setCartItems } = useContext(ShopContext);
        
      const logout = ()=>{
        navigate("/login")
        localStorage.removeItem("token")
        setToken("")
        setCartItems({})
      }



  return (
    <div className="flex item-center justify-between py-5 font-medium ">
      <img src={assets.logo} className="w-36" alt="" />
      <ul className=" hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/home" className="flex flex-col gap-1 items-center">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col gap-1 items-center">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col gap-1 items-center">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col gap-1 items-center">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
          onClick={() => setShowSearch(true)}
        />

        <div className="group relative">
          
            <img onClick={()=>token ? null : navigate("/login")}
              className="gap-5 cursor-pointer w-5"
              src={assets.profile_icon}
              alt=""
            />
            {/* {.....drop down menu} */}
            { token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-6 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-black">My profile </p>
                  <p onClick={()=>navigate("/orders")} className="cursor-pointer hover:text-black"> Order</p>
                  <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
                </div>
              </div>
            )}
          </div>
        
          
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisiable(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden "
          alt=""
        />
      </div>

      {/* side bar menu for small screen*/}

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 cursor-pointer">
          <div
            onClick={() => setVisiable(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className=" h-4 rotate-180"
              src={assets.dropdown_icon}
              alt=""
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisiable(false)}
            to="/"
            className="py-2 pl-6 border"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisiable(false)}
            to="/collection"
            className="py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisiable(false)}
            to="/contact"
            className="py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
          <NavLink
            onClick={() => setVisiable(false)}
            to="/about"
            className="py-2 pl-6 border"
          >
            ABOUT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
