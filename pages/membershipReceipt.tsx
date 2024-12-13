import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import ReceiptComponent from "../components/receipt";
import Link from "next/link";

interface PaymentData {
  id_number: number;
  recpt_date: string;
  recpt_number: number;
  status: string;
}

interface UserData {
  id_number: number;
  f_name: string;
  l_name: string;
  role: string;
}

const ReceiptPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("itsUser");
    const storedUserPayment = localStorage.getItem("userPayment");
    if(storedUserPayment){
      setPaymentData(JSON.parse(storedUserPayment));
    }

    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById("receipt");
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: "white",
        logging: true,
        useCORS: true,
        scale: 2,
        width: 900,
        height: 410,
      });
      const dataUrl = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "membership_receipt.jpg";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <ReceiptComponent userData={userData} paymentData={paymentData} />

      {/* Buttons */}
      <div className="w-full sm:w-auto">
        <button
          onClick={handleDownloadReceipt}
          className="w-full sm:w-auto mt-6 px-6 py-3 bg-baseColor text-white font-bold rounded-lg hover:bg-hoverColor transition"
        >
          Download Receipt as JPG
        </button>
      </div>
      <div className="w-full sm:w-auto">
        <Link href="/userReceipt">
          <button
            className="w-full sm:w-auto mt-2 px-5 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-600 transition"
          >
            Back to Membership Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReceiptPage;
