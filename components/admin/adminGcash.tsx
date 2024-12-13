import React from "react";
import { useRouter } from 'next/router';
import { CiSearch } from "react-icons/ci";

const Dashboard = () => {
    const router = useRouter();

    return (
            <main className="flex-1 p-3">
                <div className="mt-0 p-4 bg-white rounded shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0 md:flex md:flex-col">
                            <h1 className="text-2xl font-bold">GCash Payment List</h1>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto gap-2">
                            <div className="relative w-full md:w-64 lg:w-80 md:mb-0">
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2 pr-10 w-full h-12"
                                    placeholder="Search ID Number"
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
                                    <th className="border-b py-2 px-4 text-center">Email</th>
                                    <th className="border-b py-2 px-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border-b py-2 px-4 text-center">59696969</td>
                                    <td className="border-b py-2 px-4 text-center">John</td>
                                    <td className="border-b py-2 px-4 text-center">Doe</td>
                                    <td className="border-b py-2 px-4 text-center">example@example.com</td>
                                    <td className="border-b py-2 px-4 text-center"><strong className="text-green-500">PAID</strong></td>
                                </tr>
                                <tr>
                                    <td className="border-b py-2 px-4 text-center">59696970</td>
                                    <td className="border-b py-2 px-4 text-center">Jeny Mie</td>
                                    <td className="border-b py-2 px-4 text-center">Aguilo</td>
                                    <td className="border-b py-2 px-4 text-center">jenymie.aguilo@hcdc.edu.ph</td>
                                    <td className="border-b py-2 px-4 text-center"><strong className="text-red-500">NOT PAID</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main> 
    );
};

export default Dashboard;
