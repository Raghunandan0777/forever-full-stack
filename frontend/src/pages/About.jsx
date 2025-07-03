import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'; // Adjust the path



const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t '>
        <Title text1={"ABOUT"} text2={"US"}/>

      </div>
      <div className='my-10 flex flex-col sm:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis deserunt aperiam repellendus sit quod voluptate laborum, aspernatur nulla qui architecto in aut eaque porro provident mollitia sunt dolores ut eveniet?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet vel, delectus dolores pariatur minus et voluptate? Praesentium, officia laboriosam similique corrupti suscipit facilis voluptas quas deserunt obcaecati, facere laborum nulla.</p>
         <b className='text-gray-800'>Our Mission</b>
         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, sunt tempora laborum numquam officia, autem libero labore recusandae aliquid amet rerum inventore porro possimus consectetur? Culpa non minima nostrum incidunt?</p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Qulity Assurance:</b>
          <p className='text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus impedit, assumenda soluta, odit laborum eveniet ex hic dicta doloribus quasi, officiis culpa aliquid ea? Excepturi tempore hic quia odio provident!</p>
        </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus impedit, assumenda soluta, odit laborum eveniet ex hic dicta doloribus quasi, officiis culpa aliquid ea? Excepturi tempore hic quia odio provident!</p>
        </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer service:</b>
          <p className='text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus impedit, assumenda soluta, odit laborum eveniet ex hic dicta doloribus quasi, officiis culpa aliquid ea? Excepturi tempore hic quia odio provident!</p>
        </div>
      </div>
      <NewsLetterBox />

      
    
    </div>
  )
}

export default About
