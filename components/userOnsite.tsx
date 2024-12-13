import React from "react";
import Link from "next/link";

const Dashboard: React.FC = () => {
    

  return (
    <div className="flex flex-col justify-center items-center mt-32">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="mt-0">
                <span className="md:text-xl font-semibold">
                    Please proceed to the ITS Office to pay your membership.
                </span>
                <div className="mt-2">
                    <span className="md:text-lg font-semibold text-gray-400">
                        Located at <strong>CH 403</strong>.
                    </span>
                </div>

                <Link href="/userMemFee">
                    <button
                    className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition mt-5"
                    type="button"
                    aria-label="Back to membership fee page"
                    >
                    Back
                    </button>
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
