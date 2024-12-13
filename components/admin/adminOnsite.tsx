import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CiSearch } from "react-icons/ci";

interface Payments {
    id_number: number;
    f_name: string;
    l_name: string;
    recpt_number: number | null;
    recpt_date: string | null;
    status: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [paymentData, setPaymentData] = useState<Payments[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await fetch("/api/payments", {
                method: "GET"
            });
            if (response.ok) {
                const payments = await response.json();
                setPaymentData(payments.data);
            }
        } catch (error) {
            console.error("ERROR: ", error);
        }
    };

    const updatePaymentStatus = async (id_number: number, status: "PAID" | "NOT PAID") => {
        const currentDate = new Date().toISOString().split("T")[0];

        if(status.toUpperCase() == "PAID"){
            try {
                const response = await fetch("/api/payments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id_number,
                        status,
                        recpt_date: currentDate
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to update payment status");
                }
            } catch (error) {
                console.error("ERROR updating payment status: ", error);
            } finally {
                fetchPayments();
            }
        } else if(status.toUpperCase() === "NOT PAID"){
            try {
                const response = await fetch("/api/payments", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id_number,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to delete payment status");
                }
            } catch (error) {
                console.error("ERROR delete payment status: ", error);
            } finally {
                fetchPayments();
            }
        }
    };

    const filteredPayments = paymentData.filter((payment) =>
        payment.id_number.toString().includes(searchTerm)
    );

    return (
        <main className="flex-1 p-3">
            <div className="mt-0 p-4 bg-white rounded shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0 md:flex md:flex-col">
                        <h1 className="text-2xl font-bold">Onsite Payment List</h1>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto gap-2">
                        <div className="relative w-full md:w-64 lg:w-80 md:mb-0">
                            <input
                                type="number"
                                className="border border-gray-300 rounded px-4 py-2 pr-10 w-full h-12"
                                placeholder="Search ID Number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        <button
                            className="bg-baseColor hover:bg-hoverColor text-white px-6 py-2 h-12 rounded w-full md:w-auto"
                            onClick={() => router.back()}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <hr className="mt-5 w-full border-gray-300" />

                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="border-b py-2 px-4 text-center">ID Number</th>
                                <th className="border-b py-2 px-4 text-center">First Name</th>
                                <th className="border-b py-2 px-4 text-center">Last Name</th>
                                <th className="border-b py-2 px-4 text-center">Receipt No.</th>
                                <th className="border-b py-2 px-4 text-center">Payment Date</th>
                                <th className="border-b py-2 px-4 text-center">Change Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id_number}>
                                    <td className="border-b py-2 px-4 text-center">{payment.id_number}</td>
                                    <td className="border-b py-2 px-4 text-center">{payment.f_name}</td>
                                    <td className="border-b py-2 px-4 text-center">{payment.l_name}</td>
                                    <td className="border-b py-2 px-4 text-center">
                                        {payment.recpt_number ? (
                                            <span>{payment.recpt_number}</span>
                                        ) : (
                                            <span className="text-red-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="border-b py-2 px-4 text-center">
                                        {payment.recpt_date ? payment.recpt_date : "N/A"}
                                    </td>
                                    <td className="border-b py-2 px-4 text-center">
                                        <select
                                            value={payment.status}
                                            onChange={(e) => updatePaymentStatus(payment.id_number, e.target.value as "PAID" | "NOT PAID")}
                                            className="px-2 py-1 border rounded"
                                        >
                                            <option value="not paid">Not Paid</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
