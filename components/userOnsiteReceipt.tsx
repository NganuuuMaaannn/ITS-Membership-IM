import React, { useEffect, useState } from "react";
import Link from "next/link";

const Dashboard: React.FC = () => {
    const [userID, setUserID] = useState<number | null>(null);
    const [hasPaid, setHasPaid] = useState<boolean | null>(null); // Track if the user has paid
    const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

    // Fetch userID from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("itsUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserID(user.id_number); // Store the user ID in the state
        } else {
            setIsLoading(false); // Stop loading if no user is found
            console.error("No user ID found in localStorage");
        }
    }, []);

    // Check payment status after userID is set
    useEffect(() => {
        if (userID !== null) {
            checkUserPayment(); // Only call if userID is available
        }
    }, [userID]);

    // Function to check if the user has paid
    const checkUserPayment = async () => {
        setIsLoading(true); // Set loading to true while making the API request
        if (userID) {
            try {
                const response = await fetch(`/api/getUserPayment?id_number=${userID}`);
                const result = await response.json();
                console.log(result)
                if (response.ok) {
                    setHasPaid(true);
                    localStorage.setItem('userPayment', JSON.stringify(result.user))
                } else {
                    console.error("Failed to fetch payment status", response.status);
                    setHasPaid(false);
                }
            } catch (error) {
                console.error("ERROR fetching payment status: ", error);
                setHasPaid(false); // If there's an error, assume the user has not paid
            } finally {
                setIsLoading(false); // Stop loading after the API call finishes
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mt-32">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="mt-0">
                    {/* Show loading state while fetching payment status */}
                    {isLoading ? (
                        <span>Loading payment status...</span> // You could add a spinner here
                    ) : hasPaid === true ? (
                        <>
                            <span className="md:text-xl font-semibold">
                                You&apos;ve already paid your membership fee.
                            </span>
                            <Link href="/membershipReceipt">
                                <button
                                    className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition mt-10"
                                    type="button"
                                    aria-label="View your receipt"
                                >
                                    Click to view your Receipt
                                </button>
                            </Link>
                            <Link href="/userMemFee">
                                <button
                                    className="w-full font-bold bg-gray-800 text-white py-3 rounded-md hover:bg-gray-600 transition mt-2"
                                    type="button"
                                    aria-label="View your receipt"
                                >
                                    Back to Membership Fee
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
