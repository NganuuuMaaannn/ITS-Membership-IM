"use client";

import React, { useState } from "react"; // Import useState to manage loading state
import Link from "next/link";
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';
import logoLogin from "../image/logoLogin2.png";

const ResetPass = () => {
  const [loading] = useState(false); // Declare the loading state

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <PuffLoader color="#36454F" size={100} speedMultiplier={1} />
        </div>
      ) : (
        <div className="flex min-h-screen justify-center items-center bg-bgLogin p-4">
          <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl">
            <div className="flex items-center justify-center w-full md:w-1/2 mb-8 md:mb-0">
              <Image
                src={logoLogin}
                alt="ITS Logo"
                className="h-40 md:h-30 lg:h-48 object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-full md:w-1/2">
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="mt-0">
                  <span className="md:text-xl font-semibold">
                    If you have forgotten your password, you must go to the ITS Office to reset your password.
                  </span>
                  <div className="mt-2">
                      <span className="md:text-lg font-semibold text-gray-400">
                          Located at <strong>CH 403</strong>.
                      </span>
                  </div>  
                  <Link href="/login">
                    <button
                      className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition mt-5"
                      type="button"
                    >
                      Back to Login
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPass;
