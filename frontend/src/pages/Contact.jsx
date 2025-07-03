import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-10 border-10">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div>
        {/* Flex container for image + contact info */}
        <div className="my-10 flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
          {/* Left - Image */}
          <img
            className="w-full md:max-w-[480px]"
            src={assets.contact_img}
            alt=""
          />

          {/* Right - Contact Info */}
          <div className="flex flex-col justify-center items-start gap-6">
            <p className="font-semibold text-gray-600 text-xl">Our Store</p>
            <p className="text-gray-500">Surat, Gujarat</p>
            <p className="text-gray-500">
              Mob: 8866902356 <br />
              Raghunandanshah4@gmail.com
            </p>
            <p className="font-semibold text-xl text-gray-600">
              Career At FOREVER
            </p>
            <p className="text-gray-500">
              Learn more about our team and job openings
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black text-gray-500 transition-all duration-500">
              Explore jobs
            </button>
          </div>
        </div>
        <NewsLetterBox />
      </div>
    </div>
  );
};

export default Contact;
