import React from "react";
import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center mt-32">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="mt-0 text-center">
            <span className="md:text-xl font-semibold">
                Gcash payment coming soon...
            </span>
            <div className="flex justify-center mt-4">
                <img
                src="/rickroll2.gif"
                alt="Rick Roll"
                className="w-3/4 max-w-lg rounded-lg shadow-lg"
                />
            </div>
            <button
                onClick={() => router.push('/userMemFee')}
                className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition mt-5"
                type="button"
                aria-label="Back to membership fee page"
            >
                Back
            </button>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
