import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/userSancDB";

const Sanction: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ id_number: number; f_name: string; l_name: string; role: string } | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  const handleDashboardClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("itsUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    if (!user) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative min-h-screen bg-gray-100">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header toggleSidebar={toggleSidebar} />
          </div>

          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-[48px] left-0 h-[calc(100vh-48px)] w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto`} // Adjusted height
          >
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              displayUser={userData}
              handleLogout={handleLogout}
            />
          </div>

          {/* Dashboard Content */}
          <div className="p-3 pt-[60px] transition-all duration-300" onClick={handleDashboardClick}>
            <Dashboard />
          </div>
        </div>
      )}
    </>
  );
};

export default Sanction;
