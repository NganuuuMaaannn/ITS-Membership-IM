import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AttendLoader from "../../components/Loader";

interface Event {
  title: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeletedFailed, setIsDeletedFailed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedFailed, setIsAddedFailed] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateFailed, setIsUpdateFailed] = useState(false);
  const [isLoad, setIsLoad] = useState(false);


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
    fetchEvents();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const openDeleteModal = (eventName: string) => {
    setEventToDelete(eventName);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndex(null);
    setNewEventTitle("");
    setNewEventDate("");
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        method: 'GET'
      });
      if (response.ok) {
        const fetchedEvents = await response.json();
        setEvents(fetchedEvents);
        localStorage.setItem("events", JSON.stringify(fetchedEvents));
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newEventTitle || !newEventDate) {
      alert("Please fill in both the title and the date.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      let response;
  
      if (editingIndex !== null) {
        const eventToUpdate = events[editingIndex];
  
        response = await fetch("/api/events", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: eventToUpdate.title,
            newName: newEventTitle,
            newEventDate: newEventDate,
          }),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
  
          const updatedEvents = [...events];
          updatedEvents[editingIndex] = { title: newEventTitle, date: newEventDate };
          setEvents(updatedEvents);
          setIsUpdate(true);
          setTimeout(() => setIsUpdate(false), 2000);
          setIsLoad(false);
          closeModal();
          fetchEvents();
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          setIsUpdateFailed(true);
          setTimeout(() => setIsUpdateFailed(false), 2000);
        }
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: newEventTitle,
            eventDate: newEventDate,
          }),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
  
          const updatedEvents = [...events, { title: newEventTitle, date: newEventDate }];
          setEvents(updatedEvents);
  
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000);
          setIsLoad(false);
          closeModal();
          fetchEvents();
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          setIsAddedFailed(true);
          setTimeout(() => setIsAddedFailed(false), 2000);
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while saving the event.");
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };    

  const handleDelete = (eventName: string) => {
    openDeleteModal(eventName);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: eventToDelete,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        const updatedEvents = events.filter((event) => event.title !== eventToDelete);
        setEvents(updatedEvents);
        setIsDeleted(true);
        setTimeout(() => setIsDeleted(false), 2000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        setIsDeletedFailed(true);
        setTimeout(() => setIsDeletedFailed(false), 2000);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while deleting the event.");
    } finally {
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEventClick = async (index: number) => {
    setIsLoad(true);
    await fetchEvents();
    setIsLoad(false);
    router.push(`/event/${index}`);
  };

  return (
    <>
      {isLoad ? (
        <AttendLoader />
      ) : (
      <div className="flex flex-col">
        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center w-full">
              No Events yet. Click <FaPlus className="inline-block text-baseColor"/> to create an event.
            </p>
          ) : (
            events.slice()
                  .map((event, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-100 transition-all cursor-pointer"
                onClick={() => handleEventClick(index)}
              >
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-bold">{event.title}</h3>
                  <p className="text-gray-500">{event.date}</p>
                </div>
                <div className="ml-auto flex space-x-2 mt-2 sm:mt-0">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingIndex(index);
                    setNewEventTitle(event.title);
                    setNewEventDate(event.date);
                    openModal();
                  }}
                >
                  <FaEdit className="text-lg md:text-xl" />
                  
                </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.title);
                    }}
                  >
                    <FaTrash className="text-lg md:text-xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button */}
        <div className="flex flex-col items-center mt-4">
          <hr className="w-full border-gray-300" />
          <button
            className="bg-baseColor text-white p-2 rounded-full hover:bg-hoverColor transition mt-2"
            onClick={() => openModal()}
          >
            <FaPlus className="text-lg md:text-xl" />
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl">
              <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? "Edit Event" : "Add Event"}</h2>
              <div className="flex flex-col space-y-2">
                <input
                  className="border p-2 rounded focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event Title"
                />
                <input
                  className="border p-2 rounded w-full focus:border-blue-500 focus:outline-none sm:w-1/2 text-sm sm:text-base"
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  className="bg-baseColor hover:bg-hoverColor text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  {editingIndex !== null ? "Save Changes" : "Add Event"}
                </button>
                <button
                  className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Event</h2>
              <p>Are you sure you want to delete the event &quot;{eventToDelete}&quot;? This will also drop the corresponding table.</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  className="bg-baseColor hover:bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Event Successfully Deleted!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>      
        )}

        {isDeletedFailed && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-red-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Failed to Delete Event!</span>
              <FaTimesCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>      
        )}

        {isAdded && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Event Successfully Added!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}
        
        {isAddedFailed && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-red-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Failed to Add Event!</span>
              <FaTimesCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}

        {isUpdate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Event Successfully Updated!</span>
              <FaCheckCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}

        {isUpdateFailed && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-red-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
              <span className="text-sm sm:text-lg font-semibold">Failed to Update Event!</span>
              <FaTimesCircle className="text-2xl sm:text-4xl" />
            </div>
          </div>
        )}

      </div>
    )}
  </> 
  );
};

export default Dashboard;
