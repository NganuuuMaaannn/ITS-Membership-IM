import React from "react";
import { FaUser, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import { LuScale } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import logo2 from "../image/logo2.png";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  displayUser: { id_number: number; f_name: string; l_name: string; role: string } | null;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  displayUser,
  handleLogout,
}) => {
  const isAdmin = displayUser?.role === "admin";
  const isStudent = displayUser?.role === "student";
  return (
    <>
      {isSidebarOpen && (
        <aside className="bg-gray-800 text-white w-64 p-4">
          <div className="flex items-center mb-4">
            <h1 className="text-xl font-bold mb-2">ITS Membership Fee System</h1>
            <Image 
              src={logo2} 
              alt="Logo" 
              className="h-10 w-auto pr-2 md:h-10 sm:h-5" 
            />
          </div>
          {displayUser ? (
            <>
              <p className="text-gray-400">{`${displayUser.l_name}, ${displayUser.f_name}`}</p>
              <p className="text-gray-400 mb-0">{`${displayUser.id_number} (${displayUser.role})`}</p>
            </>
          ) : (
            <p className="text-gray-400">No user data available</p>
          )}
          <nav className="mt-8">

            {/* Admin-specific options */}
            {isAdmin && (
              <>
                <Link href="/adminAttendance">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaUser className="mr-2" /> Attendance / Event
                  </button>
                </Link>
                <Link href="/adminSanction">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <LuScale className="mr-2" /> Sanction
                  </button>
                </Link>
                <Link href="/adminMemFee">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaMoneyBill className="mr-2" /> Membership Fee List
                  </button>
                </Link>
                <Link href="/adminIncomeRep">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaMoneyBill className="mr-2" /> Income Report
                  </button>
                </Link>
                <Link href="/adminStudentList">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaMoneyBill className="mr-2" /> Student List
                  </button>
                </Link>
                <Link href="/adminChangePassword">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full text-left flex items-center">
                    <IoKey className="mr-2" /> Change Password
                  </button>
                </Link>
              </>
            )}













            {/* Student-specific options */}
            {isStudent && (
              <>
                <Link href="/userDash">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <MdDashboard className="mr-2" /> Dashboard
                  </button>
                </Link>
                <Link href="/userMemFee">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaMoneyBill className="mr-2" /> Membership Fee
                  </button>
                </Link>
                <Link href="/userSanction">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 w-full mb-2 text-left flex items-center">
                    <FaUser className="mr-2" /> Attendance/Sanction
                  </button>
                </Link>
                <Link href="/userChangePassword">
                  <button className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full text-left flex items-center">
                    <IoKey className="mr-2" /> Change Password
                  </button>
                </Link>
              </>
            )}






            

            {/* Common options for both students and admins */}
            <button
              onClick={handleLogout}
              className="mt-2 bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full text-left flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
