import React from 'react'
import { assets } from '../assets/assets'

function Navbar({ setToken }) {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-white border-b border-gray-100'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={()=>setToken("")}
        className='bg-white border border-blue-500 text-blue-600 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-50 transition'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
