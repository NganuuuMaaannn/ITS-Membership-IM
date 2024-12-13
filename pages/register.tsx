"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";
import Image from 'next/image';
import logoLogin from "../image/logoLogin2.png";
import logo from "../image/logo2.png";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle  } from "react-icons/fa";

const capitalizeWords = (str: string) =>
  str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const initialValues = {
    f_name: "",
    l_name: "",
    gender: "",
    id_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    f_name: Yup.string()
      .required("Required")
      .min(2, "Must be at least 2 characters long")
      .matches(/^[a-zA-Z\s]+$/, "Firstname can only contain letters"),
    l_name: Yup.string()
      .required("Required")
      .min(2, "Must be at least 2 characters long")
      .matches(/^[a-zA-Z\s]+$/, "Lastname can only contain letters"),
    gender: Yup.string()
      .required("Required")
      .oneOf(["Male", "Female"], "Please select a valid gender"),
    id_number: Yup.string()
      .required("Required")
      .matches(/^59\d{6}$/, "ID Number must start with '59' and contain only numbers")
      .length(8, "ID Number must be exactly 8 digits"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(/^[a-zA-Z]+[.][a-zA-Z]+@hcdc\.edu\.ph$/, "Email must be a HCDC email with a format (firstname.lastname@hcdc.edu.ph)")
      .required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, "Password must contain letters and at least one number"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const formattedValues = {
          ...values,
          f_name: capitalizeWords(values.f_name),
          l_name: capitalizeWords(values.l_name),
        };

        console.log("Registration attempted with:", formattedValues);

        const response = await fetch("/api/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Show success modal
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          router.push("/");
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        setRegisterError(true);
        setTimeout(() => setRegisterError(false), 3000);
      } finally {
        setLoading(false);
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

      {registerError && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="flex items-center space-x-4 p-4 sm:p-6 bg-red-500 text-white rounded shadow-lg animate-pulse max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-sm sm:text-lg font-semibold">Registration Failed!</span>
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
              <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap">
                  <div className="flex flex-col">
                    <h1 className="md:text-2xl hidden sm:block font-bold">ITS Membership</h1>
                    <h1 className="md:text-2xl hidden sm:block font-bold">System</h1>
                  </div>
                  <div className="flex items-end">
                    <Image src={logo} alt="ITS Logo" className="h-12 w-12 md:h-14 md:w-14 hidden sm:block" />
                  </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="mt-1 block w-full border-2 border-gray-200 rounded-md shadow-sm h-10 pl-2 focus:border-blue-500 focus:outline-none"
                      {...formik.getFieldProps("f_name")}
                    />
                    {formik.touched.f_name && formik.errors.f_name && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.f_name}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="mt-1 block w-full border-2 border-gray-200 rounded-md shadow-sm h-10 pl-2 focus:border-blue-500 focus:outline-none"
                      {...formik.getFieldProps("l_name")}
                    />
                    {formik.touched.l_name && formik.errors.l_name && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.l_name}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <select
                      className="mt-4 block w-full border-2 border-gray-200 rounded-md shadow-sm h-10 pl-2 focus:border-blue-500 focus:outline-none"
                      {...formik.getFieldProps("gender")}
                    >
                      <option value="" label="Select gender" />
                      <option value="Male" label="Male" />
                      <option value="Female" label="Female" />
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="ID Number"
                      className="mt-1 block w-full border-2 border-gray-200 rounded-md shadow-sm h-10 pl-2 focus:border-blue-500 focus:outline-none"
                      {...formik.getFieldProps("id_number")}
                    />
                    {formik.touched.id_number && formik.errors.id_number && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.id_number}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="HCDC Email"
                      className="mt-1 block w-full border-2 border-gray-200 rounded-md shadow-sm h-10 pl-2 focus:border-blue-500 focus:outline-none"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                  </div>
                  <div className="mb-4 relative">
                    <div className="flex items-center border-2 border-gray-300 rounded-md shadow-sm h-12 focus-within:border-blue-500">
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

                  <div className="mb-4 relative">
                    <div className="flex items-center border-2 border-gray-300 rounded-md shadow-sm h-12 focus-within:border-blue-500">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="h-full w-full pl-3 border-none rounded-md focus:outline-none"
                        {...formik.getFieldProps("confirmPassword")}
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
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                  <button
                    className="w-full bg-baseColor hover:bg-hoverColor text-white py-2 rounded-md"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    Register
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <span className="text-sm">Already have an account?</span>
                  <Link href="/">
                    <span className="ml-1 font-bold text-baseColor text-sm hover:underline">Login</span>
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

export default Register;
