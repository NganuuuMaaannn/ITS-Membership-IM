import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import hcdclogo from "../image/hcdc2.png";
import { BsList } from "react-icons/bs";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  const getHeaderText = () => {
    switch (router.pathname) {
      case "/adminAttendance":
        return "Attendance/Event";
      case "/adminSanction":
        return "Sanction";  
      case "/adminMemFee":
        return "Membership Fee";
      case "/adminIncomeRep":
        return "Income Report";
      case "/adminStudentList":
        return "Student List";
      case "/adminChangePassword":
          return "Change Password";


      case "/userDash":
        return "Dashboard";    
      case "/userMemFee":
        return "Membership Fee"; 
      case "/userSanction":
        return "Attendance/Sanction";
      case "/userChangePassword":
        return "Change Password";
      case "/userReceipt":
        return "Pay Onsite";
      case "/userMemOnsite":
        return "Pay Onsite";       
      case "/userMemGcash":
        return "GCash";

      
      case "/event/[id]":
        return"Attendance/Event";    
          
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-baseColor text-white flex items-center justify-between h-12 p-3">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-white focus:outline-none mr-2 flex items-center">
          <div className="flex flex-col">
            <BsList size={30} />
          </div>
        </button>
        <h2 className="text-white font-semibold md:text-2xl sm:text-xl ml-1">{getHeaderText()}</h2>
      </div>
      <div className="flex items-center">
        <Image 
          src={hcdclogo} 
          alt="Logo" 
          className="h-10 w-auto pr-2" 
        />
      </div>
    </div>
  );
};

export default Header;
