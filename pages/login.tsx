import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";
import Image from 'next/image';
import { useAuth } from "../context/AuthContext";
import logoLogin from "../image/logoLogin2.png";
import logo from "../image/logo2.png";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle  } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/adminAttendance");
      } else if (user.role === "student") {
        router.push("/userDash");
      }
    }
  }, [user, router]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required")
      .matches(/^[a-zA-Z]+[.][a-zA-Z]+@hcdc\.edu\.ph$/, "Email must be in the format (firstname.lastname@hcdc.edu.ph)"),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long"),
  });  

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("/api/login-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
  
        // Success flow
        setShowModal(true); // Show success modal
  
        setTimeout(() => {
          setShowModal(false);
          setLoading(true);
  
          setTimeout(() => {
            setLoading(false);
            login(data.user);
          }, 2000);
        }, 2000);
      } catch (error: unknown) {
        console.error("Login error:", error);
        
        // Failure flow
        setLoginError(true); // Show error modal
  
        setTimeout(() => {
          setLoginError(false); // Hide error modal
          setLoading(false); // Reset loading
        }, 2000);
      } finally {
        setSubmitting(false);
      }
    },
  });
  

  return (
    <>
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex items-center space-x-4 p-4 sm:p-6 bg-green-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
          <span className="text-sm sm:text-lg font-semibold">Login Successfully!</span>
          <FaCheckCircle className="text-2xl sm:text-4xl" />
        </div>
      </div>
    )}

    {loginError && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex items-center space-x-4 p-4 sm:p-6 bg-red-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
          <span className="text-sm sm:text-lg font-semibold">Login Failed!</span>
          <FaTimesCircle className="text-2xl sm:text-4xl" />
        </div>
      </div>
    )}

    {loading && <Loader />}

    {!loading && !showModal && (
      <div className="flex min-h-screen justify-center items-center bg-bgLogin p-4">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl">
          <div className="flex items-center justify-center w-full md:w-1/2 mb-8 md:mb-0">
            <Image
              src={logoLogin}
              alt="ITS Logo"
              className="h-40 md:h-30 lg:h-48 object-contain"
            />
          </div>
          <div className="flex items-center justify-center w-full md:w-1/2">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap">
                <div className="flex flex-col">
                  <h1 className="md:text-2xl hidden sm:block font-bold ">ITS Membership</h1>
                  <h1 className="md:text-2xl hidden sm:block font-bold">System</h1>
                </div>
                <div className="flex items-end">
                  <Image src={logo} alt="ITS Logo" className="h-12 w-12 md:h-14 md:w-14 hidden sm:block" />
                </div>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-12 pl-3 focus:border-blue-500 focus:outline-none"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>
                <div className="mb-4 relative">
                  <div
                    className="flex items-center border-2 border-gray-300 rounded-md shadow-sm h-12 focus-within:border-blue-500"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="h-full w-full pl-3 border-none rounded-md focus:outline-none"
                      {...formik.getFieldProps("password")}
                    />
                    <span
                      className="flex items-center cursor-pointer pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible className="text-gray-400" />
                      ) : (
                        <AiFillEye className="text-gray-400" />
                      )}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>
                <button
                  className="w-full font-bold bg-baseColor text-white py-3 rounded-md mb-2 hover:bg-hoverColor transition"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Log In
                </button>
                <Link href="/register">
                  <button
                    className="w-full font-bold bg-baseColor text-white py-3 rounded-md hover:bg-hoverColor transition"
                    type="button"
                  >
                    Sign Up
                  </button>
                </Link>
              </form>
              <div className="mt-4 text-center">
                <span className="text-sm font-semibold">Forgot password?</span>
                <Link href="/resetpass">
                  <span className="ml-1 font-bold text-baseColor text-sm hover:underline">Click here</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Login;