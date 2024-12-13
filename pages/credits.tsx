import React from "react";
import Link from "next/link";
import Image from 'next/image';
import chanchan from "../image/chanchan.jpg";
import jeni from "../image/jeni.png";
import sean from "../image/sean2.jpg";

const Credits: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgLogin text-black p-6 flex flex-col items-center">
      {/* Fixed Back Button */}
      <div className="fixed top-4 right-4">
        <Link href="/">
          <button className="px-4 py-2 bg-baseColor text-white rounded-lg hover:bg-hoverColor shadow-md">
            Back
          </button>
        </Link>
      </div>

      {/* Credits Section */}
      <div className="space-y-10">
        {/* Credit Item */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Image Section */}
          <div className="w-48 h-48 md:w-64 md:h-64">
            <Image
              src={chanchan}
              alt="Christian Lorrence"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Text Section */}
          <div className="text-center md:text-left max-w-md">
            <h1 className="text-xl md:text-3xl font-bold mt-4 md:mt-0">
              Alparo, Christian Lorrence
            </h1>
            <p className="text-lg">Back End</p>
          </div>
        </div>

        {/* Credit Item */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-4 md:gap-6">
          {/* Image Section */}
          <div className="w-48 h-48 md:w-64 md:h-64">
            <Image
              src={sean}
              alt="Sean Michael"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Text Section */}
          <div className="text-center md:text-left max-w-md">
            <h1 className="text-xl md:text-3xl font-bold mt-4 md:mt-0">
              Doinog, Sean Michael
            </h1>
            <p className="text-lg">Front End</p>
          </div>
        </div>

        {/* Credit Item */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Image Section */}
          <div className="w-48 h-48 md:w-64 md:h-64">
            <Image
              src={jeni}
              alt="Jeny Mie"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Text Section */}
          <div className="text-center md:text-left max-w-md">
            <h1 className="text-xl md:text-3xl font-bold mt-4 md:mt-0">
              Aguilo, Jeny Mie
            </h1>
            <p className="text-lg">Papers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
