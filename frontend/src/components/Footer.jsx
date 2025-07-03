import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <div>
      <div className='grid grid-col md:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Column 1: Logo + Description */}
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Logo" />
          <p className='text-gray-600 w-full md:w-2/3 '>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In, cupiditate! Error magni aut ratione, consectetur neque dicta iste debitis mollitia a quia aliquam magnam quos temporibus sequi pariatur natus voluptatibus.
          </p>
        </div>

        {/* Column 2: COMPANY */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Column 3: GET IN TOUCH */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>8866902356</li>
            <li>Raghunandanshah4@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-10 text-sm text-center'>CopyRight 2025@ Raghunandan Shah . All Right Reserved</p>
      </div>
    </div>
  )
}

export default Footer
 