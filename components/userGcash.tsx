import React, { useState } from "react";
import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const handleProceed = async () => {
    try {
      const response = await fetch('/api/paymongo', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        const paymentUrl = data.data.attributes.checkout_url;
      
        const paymentWindow = window.open(paymentUrl, '_blank');
        
        if (paymentWindow) {
          paymentWindow.focus();

          const timer = setInterval(() => {
            if (paymentWindow.closed) {
              clearInterval(timer);
              setPaymentSuccessful(true);
            }
          }, 1000);
        }
      } else {
        console.error('Failed to create payment link:', data.error);
        alert('Unable to proceed to payment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create payment link', error);
      alert('Unable to proceed to payment. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mt-0">
          <span className="md:text-xl font-semibold">
            Please click the button to continue with GCash.
          </span>
          <button
            onClick={handleProceed}
            className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition mt-5"
            type="button"
            aria-label="Proceed to PayMongo"
          >
            Proceed
          </button>

          <button
            onClick={() => router.push('/userMemFee')}
            className="w-full font-bold bg-gray-800 text-white py-3 rounded-md hover:bg-gray-600 transition mt-2"
            type="button"
            aria-label="Back to membership fee page"
          >
            Back
          </button>
        </div>
      </div>

      {paymentSuccessful && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-green-500">Payment Successful!</h2>
          <p>Your payment has been completed!</p>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="bg-baseColor hover:bg-hoverColor text-white px-4 py-2 rounded"
              onClick={() => setPaymentSuccessful(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
