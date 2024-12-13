import React from "react";
import Image from "next/image";
import logo2 from "../image/logo2.png";

interface PaymentData {
  id_number: number;
  recpt_date: string;
  recpt_number: number;
  status: string;
}

interface ReceiptComponentProps {
  userData: { f_name: string; l_name: string } | null;
  paymentData: PaymentData | null;
}

const ReceiptComponent: React.FC<ReceiptComponentProps> = ({ userData, paymentData }) => {
  return (
    <div className="overflow-x-auto w-full flex justify-center">
      <div
        id="receipt"
        className="min-w-[900px] h-[400px] bg-white shadow-lg rounded-lg p-6"
        style={{
          transformOrigin: "top center",
        }}
      >
        <div className="border-2 border-gray-300 rounded-md p-4 h-full">
          {/* Header */}
          <div className="flex flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-12 w-12 bg-gray-300 rounded-full mt-0 flex items-center justify-center">
                <Image src={logo2} alt="Logo" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold">HCDC Information Technology Society</p>
                <p className="text-sm text-gray-600">ITS Membership Fee System</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-baseColor">MEMBERSHIP RECEIPT</p>
              <p className="text-sm text-gray-600">
                https://www.facebook.com/hcdcits | itshcdc@gmail.com
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-4">
            <p className="flex flex-row justify-between text-2xl">
              <span className="whitespace-nowrap">
                NO: <span className="underline ml-5 font-bold">{paymentData?.recpt_number}</span>
              </span>
              <span className="whitespace-nowrap">
                Date: <span className="underline ml-5 font-bold">{paymentData?.recpt_date}</span>
              </span>
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-2xl">
              Received from <span className="underline ml-5 font-bold">{userData?.l_name}, {userData?.f_name}</span>
            </p>
            <p className="mb-2 text-2xl">
              the amount of <span className="underline ml-5 mr-10 font-bold">FIFTY PESOS ONLY</span> (P <span className="underline font-bold">50</span>)
            </p>
            <p className="mb-2 text-2xl">
              as full/partial payment of <span className="underline ml-5 font-bold">ITS Membership Fee</span>
            </p>
          </div>

          <div className="flex flex-row justify-between items-center mt-6">
            <div>
              <p className="text-2xl font-bold">INTERNAL USE ONLY</p>
            </div>
            <div>
              <p className="text-2xl">
                Received by <span className="underline font-bold">Crissalyn Casuyon</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
