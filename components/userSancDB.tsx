import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import logo2 from "../image/logo2.png";

interface SanctionData {
  offense_number: number;
  donation: string[];
  donation_count: number[];
  min_absences: number;
  max_absences: number;
}

interface EventData {
  morningin: string;
  morningout: string;
  afternoonin: string;
  afternoonout: string;
}

interface EventWithName {
  tableName: string;
  eventDate: string;
  data: EventData[];
}

const Dashboard: React.FC = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [isInSanction, setIsInSanction] = useState<boolean>(false);
  const [sanctionData, setSanctionData] = useState<SanctionData[]>([]);
  const [eventData, setEventData] = useState<EventWithName[]>([]);

  const fetchSancData = async () => {
    try {
      const response = await fetch("/api/get-sanction-data");
      if (response.ok) {
        const fetchedSancData = await response.json();
        const sortedData = fetchedSancData.data.sort(
          (a: SanctionData, b: SanctionData) => a.offense_number - b.offense_number
        );
        setSanctionData(sortedData);
      } else {
        console.error("Failed to fetch sanction data.");
      }
    } catch (error) {
      console.error("Error fetching sanction data:", error);
    }
  };

  const fetchUserAttendance = async () => {
    const data = localStorage.getItem("itsUser");
    const userId = JSON.parse(data || "{}").id_number;

    try {
      if (!userId) {
        throw new Error("User ID not found in localStorage.");
      }

      const response = await fetch(`/api/get-user-attendance?id_number=${userId}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch user event data.");
      }
      setEventData(result.data);
      
      try {
        const response = await fetch(`/api/check-student?studentID=${userId}`, {
          method: "GET"
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to check user from sanction-list.");
        } else {
          if(result.studentExists){
            setIsInSanction(true);
          } else {
            setIsInSanction(false);
          }
        }
        
      } catch (error) {
        console.error("Error checking student from sanction-list:", error);
      }

    } catch (error) {
      console.error("Error fetching user event data:", error);
    }
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const handleDashboardClick = () => {
    if (isLeftSidebarOpen) {
      setLeftSidebarOpen(false);
    }
  };

  useEffect(() => {
    fetchSancData();
    fetchUserAttendance();
  }, []);

  return (
    <div className="relative flex flex-col h-screen">
      {/* Sidebar toggle button */}
      {!isLeftSidebarOpen && (
        <button
          onClick={toggleLeftSidebar}
          className="group fixed top-15 right-4 bg-baseColor text-white p-3 rounded-full hover:bg-hoverColor transition flex items-center space-x-2 z-20 animate-bounce-left"
        >
          <span className="md:group-hover:animate-bounce-left2 sm:group-hover:animate-bounce-left2">
              <IoMdArrowBack size={24} />
            </span>
          <span className="font-bold hidden sm:block">Offense Details</span>
        </button>
      )}

      {/* Sidebar that opens from the right */}
      <div
        className={`${
          isLeftSidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-[48px] right-0 h-[calc(100vh-48px)] w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <aside className="bg-gray-800 text-white w-64 p-4 overflow-hidden">
          {/* Close button in sidebar */}
          <div className="flex items-center mb-4">
            <button
              onClick={toggleLeftSidebar}
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-hoverColor transition mr-2"
            >
              <IoMdArrowForward size={24} />
            </button>
            <h1 className="text-xl font-bold">Offense Details</h1>
            <Image src={logo2} alt="Logo" className="h-10 w-auto pr-2 md:h-10 sm:h-5" />
          </div>
          {/* Sidebar Content */}
          <nav className="mt-8">
            {sanctionData.map((data) => (
              <div key={data.offense_number}>
                <p className="mb-2 flex justify-between items-center">
                  <strong>Offense {data.offense_number}</strong>
                </p>
                <p className="text-sm leading-relaxed mb-4 break-words">
                  Items to be donated:
                  <ul>
                    {data.donation.map((item, index) => (
                      <li key={index}>
                        {item} - {data.donation_count[index]}
                      </li>
                    ))}
                  </ul>
                </p>
                <p className="text-sm leading-relaxed mb-2 break-words">
                  Absences Range: {data.min_absences} to {data.max_absences}
                </p>
                <hr className="w-full border-gray-300 mb-2" />
              </div>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex flex-col" onClick={handleDashboardClick}>
        <div className="p-2">
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Total Absences</h2>
              <p className="text-gray-700">
                <strong className="text-red-500">
                  {eventData.reduce((totalAbsences, { data }) => {
                    if (data.length === 0) {
                      return totalAbsences + 4;
                    }
                    return (
                      totalAbsences +
                      data.reduce(
                        (innerTotal, event) =>
                          innerTotal +
                          (!event.morningin ? 1 : 0) +
                          (!event.morningout ? 1 : 0) +
                          (!event.afternoonin ? 1 : 0) +
                          (!event.afternoonout ? 1 : 0),
                        0
                      )
                    );
                  }, 0)}
                </strong>
              </p>

              {/* Determine which offense applies based on the total absences */}
              <h2 className="mt-4 text-xl font-bold">Offense</h2>
              {/* Determine which offense applies based on the total absences */}
              <p className="text-black font-bold">
                {
                  (() => {
                    // Calculate total absences
                    const totalAbsences = eventData.reduce((total, { data }) => {
                      if (data.length === 0) {
                        return total + 4;
                      }
                      return (
                        total +
                        data.reduce(
                          (innerTotal, event) =>
                            innerTotal +
                            (!event.morningin ? 1 : 0) +
                            (!event.morningout ? 1 : 0) +
                            (!event.afternoonin ? 1 : 0) +
                            (!event.afternoonout ? 1 : 0),
                          0
                        )
                      );
                    }, 0);

                    // If total absences are 0, display "No Offense"
                    if (totalAbsences === 0) {
                      return "No Offense";
                    }

                    // Find matching offense or default to the one with the largest max_absences
                    const matchingOffense = sanctionData.find(
                      (data) =>
                        totalAbsences >= data.min_absences &&
                        totalAbsences <= data.max_absences
                    );

                    // If no match, use the offense with the largest max_absences
                    if (!matchingOffense) {
                      const sanc = sanctionData ?? [];
                      if (sanc.length === 0) return "No Offense";

                      const maxOffense = sanc.reduce((prev, curr) =>
                        curr.max_absences > prev.max_absences ? curr : prev
                      );

                      return maxOffense.offense_number;
                    }

                    return matchingOffense.offense_number;
                  })()
                }
              </p>

              <h2 className="mt-4 text-xl font-bold">Sanction</h2>
              <p className="text-gray-600">
                <span
                    className={`text-xl font-bold ${
                      isInSanction ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {isInSanction ? "NOT PAID" : "PAID"}
                </span>
              </p>
            </div>
          </div>

          {/* Event Card Component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {eventData.map(({ tableName, eventDate, data }, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg md:text-2xl font-bold">{tableName}</h3>
                  <p className="text-gray-500 mb-5">{eventDate}</p>
                  {data.length === 0 ? (
                    <div>
                      <p className="text-lg mb-2">
                        Morning In: <strong className="text-red-500">Absent</strong>
                      </p>
                      <p className="text-lg mb-2">
                        Morning Out: <strong className="text-red-500">Absent</strong>
                      </p>
                      <p className="text-lg mb-2">
                        Afternoon In: <strong className="text-red-500">Absent</strong>
                      </p>
                      <p className="text-lg mb-2">
                        Afternoon Out: <strong className="text-red-500">Absent</strong>
                      </p>
                    </div>
                  ) : (
                    // Render event data if available
                    data.map((event, eventIndex) => {
                      const morningIn = event.morningin ? event.morningin : "Absent";
                      const morningOut = event.morningout ? event.morningout : "Absent";
                      const afternoonIn = event.afternoonin ? event.afternoonin : "Absent";
                      const afternoonOut = event.afternoonout ? event.afternoonout : "Absent";

                      return (
                        <div key={eventIndex}>
                          <p className="text-lg mb-2">
                            Morning In:{" "}
                            <strong
                              className={morningIn === "Absent" ? "text-red-500" : "text-green-500"}
                            >
                              {morningIn === "Absent" ? "Absent" : "Present"}
                            </strong>
                          </p>
                          <p className="text-lg mb-2">
                            Morning Out:{" "}
                            <strong
                              className={morningOut === "Absent" ? "text-red-500" : "text-green-500"}
                            >
                              {morningOut === "Absent" ? "Absent" : "Present"}
                            </strong>
                          </p>
                          <p className="text-lg mb-2">
                            Afternoon In:{" "}
                            <strong
                              className={afternoonIn === "Absent" ? "text-red-500" : "text-green-500"}
                            >
                              {afternoonIn === "Absent" ? "Absent" : "Present"}
                            </strong>
                          </p>
                          <p className="text-lg mb-2">
                            Afternoon Out:{" "}
                            <strong
                              className={afternoonOut === "Absent" ? "text-red-500" : "text-green-500"}
                            >
                              {afternoonOut === "Absent" ? "Absent" : "Present"}
                            </strong>
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
