import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";

const ChangePassword: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState<
  "match" | "not-match" | null
  >(null);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [idNumber, setIdNumber] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { logout } = useAuth();
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
    const itsUser = localStorage.getItem("itsUser");
    if (itsUser) {
      const parsedUser = JSON.parse(itsUser);
      setIdNumber(parsedUser.id_number);
    }
  }, []);

  const verifyCurrentPassword = async (password: string) => {
    if (!idNumber || !password) return;

    try {
      const response = await fetch(`/api/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_number: idNumber, currentPassword: password }),
      });

      const data = await response.json();
      setCurrentPasswordStatus(data.match ? "match" : "not-match");
    } catch {
      setCurrentPasswordStatus("not-match");
    }
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "New password must be at least 6 characters long"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setServerError("");
      setSuccessMessage("");

      if (!idNumber) {
        setServerError("User ID not found. Please log in again.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await fetch(`/api/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_number: idNumber,
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.error || "Failed to change password.");
        } else {
          setSuccessMessage(data.message || "Password changed successfully!");
          setIsModalOpen(false);
          formik.resetForm();
          logout();
        }
      } catch (error) {
        setServerError("An error occurred. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formik.isValid && formik.dirty) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (formik.values.currentPassword) {
      verifyCurrentPassword(formik.values.currentPassword);
    } else {
      setCurrentPasswordStatus(null);
    }
  }, [formik.values.currentPassword]);

  return (
    <div className="flex flex-col items-center mt-32 min-h-screen px-4 sm:px-0">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form
        onSubmit={handleSubmitForm}
        className="w-full max-w-md space-y-4"
      >
        <div className="mb-4 relative">
          <div
            className={`flex items-center border-2 ${
              currentPasswordStatus === "match"
                ? "border-green-500"
                : currentPasswordStatus === "not-match"
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm h-12 focus-within:border-blue-500`}
          >
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password"
              className="h-full w-full pl-3 border-none rounded-md focus:outline-none bg-gray-100"
              {...formik.getFieldProps("currentPassword")}
            />
            <span
              className="flex items-center cursor-pointer pr-3"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <AiFillEyeInvisible className="text-gray-400" />
              ) : (
                <AiFillEye className="text-gray-400" />
              )}
            </span>
          </div>
          {currentPasswordStatus === "not-match" && (
            <p className="mt-1 text-sm text-red-600">
              Current password doesn&apos;t match.
            </p>
          )}
        </div>

        <div className="mb-4 relative">
          <div
            className={`flex items-center border-2 rounded-md shadow-sm h-12 focus-within:border-blue-500 ${
              formik.values.newPassword &&
              formik.values.confirmPassword &&
              formik.values.newPassword === formik.values.confirmPassword
                ? "border-green-500"
                : formik.values.newPassword &&
                  formik.values.confirmPassword &&
                  formik.values.newPassword !== formik.values.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="h-full w-full pl-3 border-none rounded-md focus:outline-none bg-gray-100"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              name="newPassword"
            />
            <span
              className="flex items-center cursor-pointer pr-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <AiFillEyeInvisible className="text-gray-400" />
              ) : (
                <AiFillEye className="text-gray-400" />
              )}
            </span>
          </div>
        </div>

        <div className="mb-4 relative">
          <div
            className={`flex items-center border-2 rounded-md shadow-sm h-12 focus-within:border-blue-500 ${
              formik.values.newPassword &&
              formik.values.confirmPassword &&
              formik.values.newPassword === formik.values.confirmPassword
                ? "border-green-500"
                : formik.values.newPassword &&
                  formik.values.confirmPassword &&
                  formik.values.newPassword !== formik.values.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="h-full w-full pl-3 border-none rounded-md focus:outline-none bg-gray-100"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              name="confirmPassword"
            />
            <span
              className="flex items-center cursor-pointer pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="text-gray-400" />
              ) : (
                <AiFillEye className="text-gray-400" />
              )}
            </span>
          </div>
        </div>

        {serverError && <p className="text-red-500">{serverError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button
          type="submit"
          className={`w-full bg-baseColor text-white py-2 rounded mt-4 hover:bg-hoverColor transition ${
            currentPasswordStatus === "not-match" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={
            formik.isSubmitting ||
            !formik.isValid ||
            !formik.dirty ||
            currentPasswordStatus !== "match"
          }
        >
          Change Password
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Password Change</h2>
            <p>
              Are you sure you want to change your password? You will be logged out and will need to log in again.
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-baseColor hover:bg-red-500 text-white rounded px-4 py-2"
                onClick={() => formik.handleSubmit()}
              >
                Confirm
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-600 text-white rounded px-4 py-2 ml-2"
                onClick={() => setIsModalOpen(false)}
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

export default ChangePassword;
