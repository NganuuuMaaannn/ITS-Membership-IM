import React from "react";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import haha from "../image/haha.jpg";
import meme from "../image/meme.jpg";
import pic1 from "../image/pic1.png";
import hcdclogo from "../image/hcdclogo.png";
import logo2 from "../image/logo2.png";

const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Big Picture */}
      <Image src={pic1} alt="About Us" className="w-full max-w-6xl rounded-lg shadow-xl mb-8" />

      {/* Description */}
      <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl mb-12">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h4 className="text-3xl md:text-4xl font-bold text-black mt-5">About Us</h4>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            The HCDC Information Technology Society is a student organization that aims to promote the field of Information Technology to the students of Holy Cross of Davao College.
          </p>
        </div>

        <div className="w-full md:w-1/2 md:ml-10">
          <h4 className="text-3xl md:text-4xl font-bold text-black mt-5">Our Mission</h4>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            Our mission is to provide opportunities for students to enhance their IT skills, knowledge, and professional development through various activities and initiatives.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center w-full max-w-6xl mx-auto mb-12">
        <Image 
          src={logo2} 
          alt="ITS Logo" 
          className="w-32 h-32 lg:w-80 lg:h-80 md:w-48 md:h-48 object-contain lg:mx-32 md:mx-24 sm:mx-12" 
        />
        <Image 
          src={hcdclogo} 
          alt="HCDC Logo" 
          className="w-32 h-32 lg:w-80 lg:h-80 md:w-48 md:h-48 object-contain lg:mx-32 md:mx-24 sm:mx-12" 
        />
      </div>


      {/* Horizontal Rule Aligned with Image Width */}
      <hr className="w-full max-w-6xl border-gray-300 mb-8" />

      <Image src={haha} alt="About Us" className="w-full max-w-6xl rounded-lg shadow-xl mt-5 mb-8" />
      <Image src={meme} alt="About Us" className="w-full max-w-6xl rounded-lg shadow-xl mt-5 mb-8" />

      {/* Footer or Additional Info (Optional) */}
      <footer className="mt-10 text-gray-500 text-base flex flex-col md:flex-row justify-between w-full max-w-6xl">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} HCDC Information Technology Society. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/hcdcits" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-2xl hover:text-hoverColor" />
          </a>
          <a href="https://www.facebook.com/hcdcofficial" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGlobe} className="text-2xl hover:text-hoverColor" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
