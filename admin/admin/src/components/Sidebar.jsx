import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-100 bg-white'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className={({isActive}) => `flex items-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-blue-400' : 'hover:bg-blue-50 hover:text-blue-700'}`} to={'/add'}>
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Item</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-blue-400' : 'hover:bg-blue-50 hover:text-blue-700'}`} to={'/list'}>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>List Item</p>
            </NavLink>

            <NavLink className={({isActive}) => `flex items-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-blue-400' : 'hover:bg-blue-50 hover:text-blue-700'}`} to={'/orders'}>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>

        </div>
      
    </div>
  )
}

export default Sidebar
