import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

interface Event {
  event_id: string;
  title: string;
  date: string;
}

interface Attendance {
  id_number: number;
  f_name: string;
  l_name: string;
  gender: string;
  morningin: string;
  morningout: string;
  afternoonin: string;
  afternoonout: string;
}

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false });

const EventDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ id_number: number; f_name: string; l_name: string; gender: string; role: string } | null>(null);
  const [studentID, setStudentID] = useState<number | string>(""); 
  const [selectedOption, setSelectedOption] = useState<string>(""); 
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [addStudentError, setAddStudentError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (scannerOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scannerOpen]);

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

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

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

  useEffect(() => {
    if (id !== undefined) {
      const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const selectedEvent = storedEvents[parseInt(id as string, 10)];
      if (selectedEvent) {
        setEvent(selectedEvent);
      } else {
        router.push("/404");
      }
    }
  }, [id, router]);

  const handleAddStudentID = useCallback(async (): Promise<void> => {
    if (!studentID) return;

    setAddStudentError(null); 
    try {
      const response = await fetch("/api/check-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentID: studentID,
        }),
      });

      if (response.ok) {
        const { role } = await response.json();

        if (role === "admin") {
          setAddStudentError("Admin cannot be added to the attendance.");
          return;
        }

        const result = await fetch("/api/insertAttendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentID: studentID,
            eventName: event?.title,
            attendanceType: selectedOption.toLowerCase(),
            timestamp: currentTime.toString(),
          }),
        });

        if (result.ok) {
          fetchAttendanceData();
        } else {
          const { message } = await result.json();
          setAddStudentError(message || "Failed to insert student. Please try again.");
        }
      } else {
        const { message } = await response.json();
        setAddStudentError(message || "Invalid student ID. Please check and try again.");
      }
    } catch (error) {
      setAddStudentError("Error in checking student. Please try again later.");
    }

    setStudentID(""); 
  }, [studentID, event, currentTime, selectedOption]);

  const fetchAttendanceData = useCallback(async (): Promise<void> => {
    if (!event?.title) return;
  
    setAttendanceError(null);
    try {
      const response = await fetch("/api/get-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: event.title,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        setAttendanceError("Failed to fetch attendance data.");
      }
    } catch (error) {
      setAttendanceError("Error fetching attendance data. Please try again later.");
    }
  }, [event]);

  const handleScan = (data: string | null) => {
    if (data) {
      setStudentID(data);
      setScanned(true); 
      setScannerOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    handleAddStudentID(); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentID(e.target.value);
    setScanned(false); 
  };

  useEffect(() => {
    if (studentID && scanned) {
      handleAddStudentID();
      setScanned(false); 
    }
  }, [studentID, scanned, handleAddStudentID]);

  useEffect(() => {
    fetchAttendanceData();
  }, [event, fetchAttendanceData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative min-h-screen bg-gray-100" onClick={handleDashboardClick}>
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header toggleSidebar={toggleSidebar} />
          </div>
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-[48px] left-0 h-screen w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto`}
          >
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              displayUser={userData}
              handleLogout={handleLogout}
            />
          </div>
          <div className="p-3 pt-[60px] transition-all duration-300">
            <main className="flex-1 p-3">
              <div className="mt-0 p-4 bg-white rounded shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0 md:flex md:flex-col">
                    <h1 className="text-2xl font-bold break-words">{event?.title}</h1>
                    <p className="text-lg text-gray-600">Date: {event?.date}</p>
                    <p className="text-lg text-gray-600">Total Attendance: <strong>{attendanceData.length}</strong></p>
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOption('MorningIn')}
                        className={`border border-gray-300 rounded px-3 py-2 w-full sm:w-auto hover:bg-baseColor hover:text-white ${selectedOption === 'MorningIn' ? 'bg-baseColor text-white' : 'bg-white'}`}
                      >
                        Morning In
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('MorningOut')}
                        className={`border border-gray-300 rounded px-4 py-2 w-full sm:w-auto hover:bg-baseColor hover:text-white ${selectedOption === 'MorningOut' ? 'bg-baseColor text-white' : 'bg-white'}`}
                      >
                        Morning Out
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('AfternoonIn')}
                        className={`border border-gray-300 rounded px-4 py-2 w-full sm:w-auto hover:bg-baseColor hover:text-white ${selectedOption === 'AfternoonIn' ? 'bg-baseColor text-white' : 'bg-white'}`}
                      >
                        Afternoon In
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('AfternoonOut')}
                        className={`border border-gray-300 rounded px-4 py-2 w-full sm:w-auto hover:bg-baseColor hover:text-white ${selectedOption === 'AfternoonOut' ? 'bg-baseColor text-white' : 'bg-white'}`}
                      >
                        Afternoon Out
                      </button>
                    </div>
                    <input
                      type="number"
                      value={studentID}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 mb-2 sm:mb-0 sm:mr-2"
                      placeholder="Enter ID Number"
                    />
                    <button
                      type="submit"
                      className="bg-baseColor hover:bg-hoverColor text-white px-4 py-2 rounded w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setScannerOpen(!scannerOpen)} 
                      className="bg-baseColor hover:bg-hoverColor text-white px-4 py-2 rounded w-full sm:w-auto mb-2 sm:mb-0 block sm:hidden"
                    >
                      Scan ID
                    </button>
                    <button 
                      className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded w-full sm:w-auto sm:ml-2"
                      onClick={() => router.back()}
                    >
                      Back
                    </button>
                  </form>
                </div>
                {attendanceError && <p className="text-red-500 mt-2">{attendanceError}</p>}
                {addStudentError && <p className="text-red-500 mt-2">{addStudentError}</p>}
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="border-b py-2 px-4 text-center">ID Number</th>
                        <th className="border-b py-2 px-4 text-center">Name</th>
                        <th className="border-b py-2 px-4 text-center">Gender</th>
                        <th className="border-b py-2 px-4 text-center">Morning IN</th>
                        <th className="border-b py-2 px-4 text-center">Morning OUT</th>
                        <th className="border-b py-2 px-4 text-center">Afternoon IN</th>
                        <th className="border-b py-2 px-4 text-center">Afternoon OUT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.slice().reverse().map((student, index) => (
                        <tr key={index}>
                          <td className="border-b py-2 px-4 text-center font-semibold">{student.id_number}</td>
                          <td className="border-b py-2 px-4 text-center">{`${student.l_name}, ${student.f_name}`}</td>
                          <td className="border-b py-2 px-4 text-center">{student.gender}</td>
                          <td className={`border-b py-2 px-4 text-center font-semibold ${student.morningin ? '' : 'text-red-500'}`}>
                            {student.morningin || 'N/A'}
                          </td>
                          <td className={`border-b py-2 px-4 text-center font-semibold ${student.morningout ? '' : 'text-red-500'}`}>
                            {student.morningout || 'N/A'}
                          </td>
                          <td className={`border-b py-2 px-4 text-center font-semibold ${student.afternoonin ? '' : 'text-red-500'}`}>
                            {student.afternoonin || 'N/A'}
                          </td>
                          <td className={`border-b py-2 px-4 text-center font-semibold ${student.afternoonout ? '' : 'text-red-500'}`}>
                            {student.afternoonout || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {scannerOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
                  {/* Back Button */}
                  
                  {/* Scanner Overlay with Aiming Rectangle */}
                  <div className="relative">
                    <BarcodeScanner
                      onUpdate={(err, result) => {
                        if (result) handleScan(result.getText());
                      }}
                      stopStream={false}
                    />
                    
                    {/* Aiming Rectangle */}
                    <div 
                      className="absolute inset-0 border-4 border-dashed border-green-500 pointer-events-none" 
                      ref={inputRef}
                      style={{ 
                        width: '300px', 
                        height: '55px', 
                        margin: 'auto', 
                        top: 0, 
                        bottom: 0, 
                        left: 0, 
                        right: 0 
                      }}>
                    </div>
                    <button
                      onClick={() => setScannerOpen(false)}
                      className="absolute top-4 right-4 bg-baseColor hover:bg-hoverColor text-white px-4 py-2 rounded"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetail;

