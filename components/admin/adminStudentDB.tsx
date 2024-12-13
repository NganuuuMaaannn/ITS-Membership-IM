import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

interface Student {
  student_id: number;
  id_number: number;
  f_name: string;
  l_name: string;
  gender: string;
  email: string;
  password: string;
  role: string;
}

const EventDetail: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { user, loading } = useAuth();
  const router = useRouter();

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
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getallusers");
        if (response.ok) {
          const fetchedUsers = await response.json();
          setStudents(fetchedUsers.users);
        } else {
          console.error("Failed to fetch events.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredStudents = students.filter(student =>
    student.id_number.toString().includes(searchQuery)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setSearchQuery(value);
    }
  };

  const handleEditClick = (student: Student) => {
    setCurrentStudent(student);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setCurrentStudent(student);
    setDeleteModalOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleUpdate = async () => {
    if (currentStudent) {
        try {
            const response = await fetch(`/api/update-user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    student_id: currentStudent.student_id,
                    f_name: currentStudent.f_name,
                    l_name: currentStudent.l_name,
                    gender: currentStudent.gender,
                    email: currentStudent.email,
                    role: currentStudent.role,
                    password: currentStudent.password,
                }),
            });

            if (response.ok) {
                const updatedStudents = await response.json();
                setStudents(updatedStudents.users);
                setEditModalOpen(false);
            }
          } catch (error) {
              console.error("Error updating user:", error);
          }
    }
  };

  const handleDelete = async () => {
    if (currentStudent) {
        try {
            const response = await fetch(`/api/delete-user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ student_id: currentStudent.student_id }),
            });

            if (response.ok) {
                setStudents((prevStudents) => prevStudents.filter(student => student.student_id !== currentStudent.student_id));
                setDeleteModalOpen(false);
            } else {
                const errorData = await response.json();
                console.error("Error deleting user:", errorData.message);
            }
          } catch (error) {
              console.error("Error deleting user:", error);
        }
      }
  };

  // Calculate the number of Admins, Students, and the Total
  const adminCount = students.filter(student => student.role === "admin").length;
  const studentCount = students.filter(student => student.role === "student").length;
  const totalCount = students.length;

  return (
    <div className="mt-2 p-4 bg-white rounded shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold break-words">BSIT STUDENT LIST</h1>
          <div className="mt-2 mb-4 grid grid-cols-2 gap-2">
            <p>Admin:</p>
            <p className="font-bold">{adminCount}</p>
            <p>Student:</p>
            <p className="font-bold">{studentCount}</p>
            <p>Total:</p>
            <p className="font-bold">{totalCount}</p>
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
                <th className="border-b py-2 px-4 text-center">Gender</th>
                <th className="border-b py-2 px-4 text-center">Email</th>
                <th className="border-b py-2 px-4 text-center">Role</th>
                <th className="border-b py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.slice().reverse().map((student) => (
                <tr key={student.student_id}>
                  <td className="border-b py-2 px-4 text-center font-semibold">{student.id_number}</td>
                  <td className="border-b py-2 px-4 text-center">{student.f_name}</td>
                  <td className="border-b py-2 px-4 text-center">{student.l_name}</td>
                  <td className="border-b py-2 px-4 text-center">{student.gender}</td>
                  <td className="border-b py-2 px-4 text-center">{student.email}</td>
                  <td className="border-b py-2 px-4 text-center">{student.role}</td>
                  <td className="border-b py-2 px-4 text-center">
                    <button onClick={() => handleEditClick(student)} aria-label="Edit Student">
                      <FaEdit className="text-blue-500 mr-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(student)} aria-label="Delete Student">
                      <FaTrash className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card layout for smaller screens */}
        <div className="block md:hidden">
          {filteredStudents.slice().reverse().map((student) => (
            <div key={student.student_id} className="border rounded p-4 mb-4 bg-gray-100">
              <h3 className="font-bold">ID Number: {student.id_number}</h3>
              <p><strong>First Name:</strong> {student.f_name}</p>
              <p><strong>Last Name:</strong> {student.l_name}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Role:</strong> {student.role}</p>
              <div className="flex justify-end mt-2">
                <button onClick={() => handleEditClick(student)} className="text-blue-500 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClick(student)} className="text-red-500">
                  <FaTrash/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && currentStudent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-sm mx-4">
          <h2 className="text-xl font-bold">Edit Student</h2>
          <div>
            <label>ID Number:</label>
            <input
              type="number"
              value={currentStudent.id_number}
              onChange={(e) => setCurrentStudent({ ...currentStudent, id_number: +e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              readOnly
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={currentStudent.f_name}
              onChange={(e) => setCurrentStudent({ ...currentStudent, f_name: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={currentStudent.l_name}
              onChange={(e) => setCurrentStudent({ ...currentStudent, l_name: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={currentStudent.email}
              onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
            />
          </div>
          <div>
            <label>Role:</label>
            <select
              value={currentStudent.role}
              onChange={(e) => setCurrentStudent({ ...currentStudent, role: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label>Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentStudent.password}
                onChange={(e) => setCurrentStudent({ ...currentStudent, password: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 focus:outline-none"
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
          <button
              onClick={handleUpdate}
              className="bg-baseColor hover:bg-hoverColor text-white rounded px-4 py-2"
            >
              Update
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              className="bg-gray-800 hover:bg-gray-600 text-white rounded px-4 py-2 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && currentStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>
              Are you sure you want to delete user <strong>{currentStudent.f_name} {currentStudent.l_name}</strong> with ID number <strong>{currentStudent.id_number}</strong>?
            </p>
            <div className="flex justify-end mt-4">
            <button
                onClick={handleDelete}
                className="bg-baseColor hover:bg-red-500 text-white rounded px-4 py-2"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-600 text-white rounded px-4 py-2 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
