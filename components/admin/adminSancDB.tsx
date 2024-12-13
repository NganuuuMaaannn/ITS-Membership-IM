import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import logo2 from "../../image/logo2.png";
import { FaEdit, FaTrash, FaPlusSquare, FaCheckCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaRotate } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AdminLoader from "@/components/Loader";

interface Student {
  student_id: number;
  id_number: number;
  f_name: string;
  l_name: string;
  total_absences: string;
}

interface SanctionData {
  offense_number: number;
  donation: string[];
  donation_count: number[];
  min_absences: number;
  max_absences: number;
}

const Dashboard: React.FC = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [modalAddOpen, setAddModalOpen] = useState(false);
  const [modalEditOpen, setEditModalOpen] = useState(false);
  const [currentOffense, setCurrentOffense] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { user, loading } = useAuth();
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedOffenseNumber, setSelectedOffenseNumber] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sanctionData, setSanctionData] = useState<SanctionData[]>([]);
  const [sanctionEditForm, setSanctionEditForm] = useState<SanctionData>({
    offense_number: 0,
    donation: [],
    donation_count: [],
    min_absences: 0,
    max_absences: 0,
  });

  const [sanctionForm, setSanctionForm] = useState<SanctionData>({
    offense_number: 0,
    donation: [],
    donation_count: [],
    min_absences: 0,
    max_absences: 0,
  });

  const initialSanctionForm: SanctionData = {
    offense_number: 0,
    donation: [],
    donation_count: [],
    min_absences: 0,
    max_absences: 0,
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [user, loading, router]);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const handleSidebarEditClick = (offense: string, sanction: SanctionData) => {
    setCurrentOffense(offense);
    setSanctionEditForm(sanction);
    setEditModalOpen(true);
  };

  const handleSidebarAddClick = () => {
    setAddModalOpen(true);
  };

  const closeModal = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setCurrentOffense("");
    setSanctionForm(initialSanctionForm);
  };

  const handleInputUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSanctionEditForm((prev) => ({
      ...prev,
      [name]: name === 'min_absences' || name === 'max_absences'
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const handleInputAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSanctionForm((prev) => ({
      ...prev,
      [name]: name === 'min_absences' || name === 'max_absences'
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const handleUpdateSanction = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSanction = {
      offense_number: sanctionEditForm.offense_number,
      donation: sanctionEditForm.donation,
      donation_count: sanctionEditForm.donation_count,
      min_absences: sanctionEditForm.min_absences,
      max_absences: sanctionEditForm.max_absences,
    };

    try {
      const response = await fetch(`/api/update-sanction-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSanction),
      });

      if (response.ok) {
        fetchSancData();
        setIsUpdate(true);
        setTimeout(() => setIsUpdate(false), 2000);
        setRecentlyUpdated(updatedSanction.offense_number);
        setTimeout(() => setRecentlyUpdated(null), 5000);
        closeModal();
      } else {
        console.error('Failed to update sanction');
      }
    } catch (error) {
      console.error('Error updating sanction:', error);
    }
  };

  const handleCreateSanction = async () => {
    const newOffense = {
      offense_number: sanctionData.length + 1,
      donation: sanctionForm.donation,
      donation_count: sanctionForm.donation_count,
      min_absences: sanctionForm.min_absences,
      max_absences: sanctionForm.max_absences,
    };
  
    try {
      const response = await fetch(`/api/create-sanction-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffense),
      });
  
      if (response.ok) {
        fetchSancData();

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        sanctionData.push(newOffense);
        setRecentlyAdded(newOffense.offense_number);
        setTimeout(() => setRecentlyAdded(null), 4000);
        closeModal();
      } else {
        console.error("Failed to add new offense:", await response.text());
      }
    } catch (error) {
      console.error("Error adding new offense:", error);
    }
  }; 
  
  const openDeleteModal = (offense_number: number) => {
    setSelectedOffenseNumber(offense_number);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedOffenseNumber(null);
  };

  const deleteSanction = async () => {
    if (selectedOffenseNumber !== null) {
      try {
        const response = await fetch("/api/delete-sanction-data", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offense_number: selectedOffenseNumber }),
        });

        if (response.ok) {
          fetchSancData();
          setIsDeleted(true);
          setTimeout(() => setIsDeleted(false), 2000);
        } else {
          console.error("Failed to delete offense.");
        }
      } catch (error) {
        console.error("Error deleting offense:", error);
      } finally {
        closeDeleteModal();
      }
    }
  };

  const fetchSanctionList = async () => {
    try {
      const response = await fetch("/api/get-sanction-list");
      if (response.ok) {
        const fetchedSanctionList = await response.json();
        setStudents(fetchedSanctionList);
      } else {
        console.error("Failed to fetch sanction list.");
      }
    } catch (error) {
      console.error("Error fetching sanction list:", error);
    }
  };

  const fetchSancData = async () => {
    try {
      const response = await fetch("/api/get-sanction-data");
      if (response.ok) {
        const fetchedSancData = await response.json();
        const sortedData = fetchedSancData.data.sort((a: SanctionData, b: SanctionData) => a.offense_number - b.offense_number);
        setSanctionData(sortedData);
      } else {
        console.error("Failed to fetch sanction data.");
      }
    } catch (error) {
      console.error("Error fetching sanction data:", error);
    }
  };

  useEffect(() => {
    fetchSanctionList();
    fetchSancData();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.id_number.toString().includes(searchQuery)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setSearchQuery(value);
    }
  };

  const handleDashboardClick = () => {
    if (isLeftSidebarOpen) {
      setLeftSidebarOpen(false);
    }
  };

  const totalCount = students.length;

  const reloadSanctionList = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/sanction-list", {
        method: "POST",
      });

      if (!response.ok) {
        
        console.error("Failed to update sanction list.");
        setIsLoading(false);
      } else {
        fetchSanctionList();
        setIsRefreshModalOpen(false);
        console.log("Sanction list updated successfully.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calling the API:", error);
      setIsLoading(false);
    }
  }

  const handleDeleteClick = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsPaidModalOpen(true);
  };

  const handleStudentPaid = async (id_number: number) => {
    try {
      const response = await fetch("/api/delete-student-sanction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_number }),
      });
      if (response.ok) {
        alert("Sanction deleted successfully.");
      } else {
        alert("Failed to delete sanction.");
      }
    } catch (error) {
      console.error("Error deleting sanction:", error);
      alert("An error occurred while deleting the sanction.");
    }
  }

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {isLoading ? (
        <AdminLoader />
      ) : (
      <div className="relative flex flex-col h-screen">
        {!isLeftSidebarOpen && (
          <button
            onClick={toggleLeftSidebar}
            className="group fixed top-15 right-4 bg-baseColor text-white p-3 rounded-full hover:bg-hoverColor transition flex items-center space-x-2 z-20 animate-bounce-left"
          >
            <span className="md:group-hover:animate-bounce-left2 sm:group-hover:animate-bounce-left2">
              <IoMdArrowBack size={24} />
            </span>
            <span className="font-bold hidden sm:block">Edit Offense</span>
          </button>
        )}

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
              <h1 className="text-xl font-bold">SANCTION OFFENSE</h1>
              <Image
                src={logo2}
                alt="Logo"
                className="h-10 w-auto pr-2 md:h-10 sm:h-5"
              />
              
            </div>
            <button
                className="text-lg text-green-500 bg-gray-800"
                onClick={handleSidebarAddClick}
              >
                <div className="flex items-center hover:text-white">
                  <span><FaPlusSquare/></span>
                  <span className="font-bold ml-2">Add Offense</span>
                </div>
              </button>
            {/* Sidebar Content */}
            <nav className="mt-5">
              {sanctionData.map((data) => (
                <div
                    key={data.offense_number}
                    className={
                      recentlyAdded === data.offense_number || recentlyUpdated === data.offense_number
                        ? "animate-pulse"
                        : ""
                    }
                  >
                  <p className="mb-2 flex justify-between items-center">
                    <strong>Offense {data.offense_number}</strong>
                    <div className="flex space-x-2">
                      <button
                        className="text-sm text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          handleSidebarEditClick(`Offense ${data.offense_number}`, data)
                        }
                      >
                        <FaEdit className="text-lg md:text-xl" size={20} />
                      </button>
                        <button
                          className="text-sm text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(data.offense_number)}
                        >
                          <FaTrash className="text-lg md:text-xl hover:animate-pulse" size={20} />
                        </button>

                    </div>
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
                  <hr className="w-full border-gray-300 mb-2"/>
                </div>
              ))}
            </nav>
          </aside>
        </div>

        {modalEditOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[75%] md:w-[60%] lg:w-[50%] max-w-[1000px]">
              <h2 className="text-lg font-bold mb-4 text-center">Edit {currentOffense}</h2>
              <form onSubmit={handleUpdateSanction} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="offense_number" className="text-sm font-semibold">Offense Number</label>
                  <input
                    type="number"
                    id="offense_number"
                    name="offense_number"
                    value={sanctionEditForm.offense_number}
                    onChange={handleInputUpdateChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                {/* Donation */}
                <div className="flex flex-col">
                  <label htmlFor="donation" className="text-sm"> <b>Donation Items:</b> [Item1, Item2, Item3, ...]</label>
                  <input
                    type="text"
                    id="donation"
                    name="donation"
                    placeholder="Enter donation items separated by commas"
                    value={sanctionEditForm.donation.join(", ")}
                    onChange={(e) => {
                      const donationItems = e.target.value.split(",").map(item => item.trim());
                      setSanctionEditForm((prev) => ({ ...prev, donation: donationItems }));
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Donation Count */}
                <div className="flex flex-col">
                  <label htmlFor="donation_count" className="text-sm">
                    <b>Donation Count:</b>
                  </label>
                  {sanctionEditForm.donation.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-1">
                      <span className="font-semibold">{item}:</span>
                      <input
                        type="number"
                        name={`donation_count_${index}`}
                        value={sanctionEditForm.donation_count[index] || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);

                          if (value > 0) {
                            const newDonationCounts = [...sanctionEditForm.donation_count];
                            newDonationCounts[index] = value;
                            setSanctionEditForm((prev) => ({
                              ...prev,
                              donation_count: newDonationCounts,
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="p-2 border border-gray-300 rounded-md w-20"
                      />
                    </div>
                  ))}
                </div>

                {/* Absence Range */}
                <div className="flex flex-col flex-1">
                  <label htmlFor="min_absences" className="text-sm font-semibold">Min Absences</label>
                  <input
                    type="number"
                    id="min_absences"
                    name="min_absences"
                    value={sanctionEditForm.min_absences}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value >= 0 || e.target.value === "") {
                        handleInputUpdateChange(e);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="max_absences" className="text-sm font-semibold">Max Absences</label>
                  <input
                    type="number"
                    id="max_absences"
                    name="max_absences"
                    value={sanctionEditForm.max_absences}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value >= 0 || e.target.value === "") {
                        handleInputUpdateChange(e);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="submit"
                    className="bg-baseColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAddOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[75%] md:w-[60%] lg:w-[50%] max-w-[1000px]">
              <h2 className="text-lg font-bold mb-4 text-center">Create New Offense</h2>
              <form className="space-y-4">
                {/* Offense Number */}
                <div className="flex flex-col">
                  <label htmlFor="offense_number" className="text-sm font-semibold">Offense Number</label>
                  <input
                    type="number"
                    id="offense_number"
                    name="offense_number"
                    value={sanctionData.length + 1}
                    onChange={handleInputAddChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                    required
                    disabled
                  />
                </div>
          
                {/* Donation */}
                <div className="flex flex-col">
                  <label htmlFor="donation" className="text-sm">
                    <b>Donation Items:</b> [Item1, Item2, Item3, ...]
                  </label>
                  <input
                    type="text"
                    id="donation"
                    name="donation"
                    placeholder="Enter donation items separated by commas"
                    value={(sanctionForm.donation || []).join(", ")}
                    onChange={(e) => {
                      const donationItems = e.target.value.split(",").map((item) => item.trim());
                      setSanctionForm((prev) => ({ ...prev, donation: donationItems }));
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
          
                {/* Donation Count */}
                <div className="flex flex-col">
                  <label htmlFor="donation_count" className="text-sm">
                    <b>Donation Count:</b>
                  </label>
                  {(sanctionForm.donation || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-1">
                      <span className="font-semibold">{item}:</span>
                      <input
                        type="number"
                        name={`donation_count_${index}`}
                        value={sanctionForm.donation_count?.[index] || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) {
                            const newDonationCounts = sanctionForm.donation_count
                              ? [...sanctionForm.donation_count]
                              : []; // Ensure it's an array
                            newDonationCounts[index] = value;
                            setSanctionForm((prev) => ({
                              ...prev,
                              donation_count: newDonationCounts,
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (["e", "E", "-", "+", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="p-2 border border-gray-300 rounded-md w-20"
                      />
                    </div>
                  ))}
                </div>
          
                {/* Absence Range */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="min_absences" className="text-sm font-semibold mt-2">Min Absences</label>
                    <input
                      type="number"
                      id="min_absences"
                      name="min_absences"
                      value={sanctionForm.min_absences}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0 || e.target.value === "") {
                          handleInputAddChange(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "-", "+", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
          
                  <div className="flex flex-col flex-1">
                    <label htmlFor="max_absences" className="text-sm font-semibold mt-2">Max Absences</label>
                    <input
                      type="number"
                      id="max_absences"
                      name="max_absences"
                      value={sanctionForm.max_absences}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0 || e.target.value === "") {
                          handleInputAddChange(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "-", "+", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
          
                {/* Action Buttons */}
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={handleCreateSanction}
                    className="bg-baseColor text-white px-6 py-2 rounded-md hover:bg-hoverColor transition"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>      
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[50%] max-w-[400px]">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="text-sm mb-6">
                Are you sure you want to delete Offense {selectedOffenseNumber}?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                    className="bg-baseColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition hover:animate-pulse"
                    onClick={deleteSanction}
                  >
                    Delete
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded-full shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Delete Completed!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>      
        )}

        {isAdded && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded-full shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">New offense added successfully!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}

        {isUpdate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded-full shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Sanction updated successfully!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}

        {isRefreshModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[50%] max-w-[400px]">
              <h2 className="text-lg font-bold mb-4">Confirm Refresh</h2>
              <p className="text-sm mb-6">
                The sanction list will update, this will take a few seconds. Please confirm if you would like to proceed.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                    className="bg-baseColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition hover:animate-pulse"
                    onClick={reloadSanctionList}
                  >
                    Confirm
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => setIsRefreshModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isPaidModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[50%] max-w-[400px]">
              <h2 className="text-lg font-bold mb-4">Confirm Sanction Payment</h2>
              <p className="text-sm mb-6">
                Are you sure you want remove this user from sanction list?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                    className="bg-baseColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition hover:animate-pulse"
                    onClick={() => selectedStudentId && handleStudentPaid(selectedStudentId)}
                  >
                    Confirm
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => setIsPaidModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mt-2 p-4 bg-white rounded shadow-md" onClick={handleDashboardClick}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex gap-2">
                <h1 className="text-2xl font-bold break-words">SANCTION LIST</h1>
                  <button
                    className="group flex items-center gap-1 text-green-500 hover:text-white bg-gray-800 rounded-2xl text-xs p-2"
                    onClick={() => setIsRefreshModalOpen(true)}
                  > 
                    <span className="md:group-hover:animate-spin sm:group-hover:animate-none">
                      <FaRotate />
                    </span>
                    <span>Refresh</span>
                  </button>
              </div>
              <div className="mt-2 mb-4">
                <p>Total:
                  <span className="font-bold mx-4">
                    {totalCount}
                  </span>
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-64 lg:w-80 mb-5 mt-0 md:mb-0">
              <input
                type="number"
                value={searchQuery}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 pr-10 w-full h-12"
                placeholder="Search ID Number"
              />
              {searchQuery ? (
                <MdClose
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={clearSearch}
                />
              ) : (
                <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              )}
            </div>
          </div>

          <hr className="mt-0 w-full border-gray-300" />

          <div className="mt-5 overflow-x-auto">
            {/* Table for larger screens */}
            <div className="hidden md:block">
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="border-b py-2 px-4 text-center">ID Number</th>
                    <th className="border-b py-2 px-4 text-center">First Name</th>
                    <th className="border-b py-2 px-4 text-center">Last Name</th>
                    <th className="border-b py-2 px-4 text-center">Total Absences</th>
                    <th className="border-b py-2 px-4 text-center">Offense</th>
                    <th className="border-b py-2 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.slice().reverse().map((student) => {
                    const total = parseInt(student.total_absences);
                    const matchingOffense =
                      sanctionData.find(
                        (data) =>
                          total >= data.min_absences &&
                          total <= data.max_absences
                      ) ||
                      sanctionData[sanctionData.length - 1];

                    return (
                      <tr key={student.student_id}>
                        <td className="border-b py-2 px-4 text-center font-semibold">
                          {student.id_number}
                        </td>
                        <td className="border-b py-2 px-4 text-center">{student.f_name}</td>
                        <td className="border-b py-2 px-4 text-center">{student.l_name}</td>
                        <td className="border-b py-2 px-4 text-center">
                          {student.total_absences}
                        </td>
                        <td className="border-b py-2 px-4 text-center">
                          {matchingOffense?.offense_number || "N/A"}
                        </td>
                        <td className="border-b py-2 px-4 text-center">
                          <button
                            className="items-center text-sm text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(student.id_number)}
                          >
                            <FaCheck className="text-lg md:text-xl hover:animate-pulse" size={25} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card layout for smaller screens */}
            <div className="block md:hidden">
              {filteredStudents.slice().reverse().map((student) => {
                const total = parseInt(student.total_absences);
                const matchingOffense =
                  sanctionData.find(
                    (data) =>
                      total >= data.min_absences &&
                      total <= data.max_absences
                  ) || sanctionData[sanctionData.length - 1];

                return (
                  <div
                    key={student.student_id}
                    className="border rounded p-4 mb-4 bg-gray-100"
                  >
                    <h3 className="font-bold">ID Number: {student.id_number}</h3>
                    <p>
                      <strong>First Name:</strong> {student.f_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {student.l_name}
                    </p>
                    <p>
                      <strong>Total Absences:</strong> {student.total_absences}
                    </p>
                    <p>
                      <strong>Offense:</strong> {matchingOffense?.offense_number || 'N/A'}
                    </p>
                    <div className="flex justify-end mt-2">
                      <button
                        className="items-center text-sm text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(student.id_number)}
                        >
                          <FaCheck className="text-lg md:text-xl hover:animate-pulse" size={25} />
                      </button>
                    </div>  
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )}
  </> 
  );
};

export default Dashboard;