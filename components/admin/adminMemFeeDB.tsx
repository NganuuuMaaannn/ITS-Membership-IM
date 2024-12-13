import React, { useEffect } from "react";
import Image from "next/image";
import gcash from "../../image/gcash3.png";
import onsite from "../../image/onsite2.png";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const MemFee: React.FC = () => {
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

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen md:px-4 sm:px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">List of Payments</h1>
      <div className="w-full max-w-md">
        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-10 sm:space-y-0 justify-center">

          <Link
            href="/adminMemGcashList"
            className="w-full min-w-[350px] sm:w-auto max-w-xs mx-auto bg-blue-500 text-white text-xl font-bold py-20 rounded hover:bg-blue-600 transition flex flex-col items-center justify-center"
          >
            <Image
              src={gcash}
              alt="GCash Logo"
              className="w-24 h-24 mb-4"
            />
            GCash
          </Link>

          <Link
            href="/adminMemOnsiteList"
            className="w-full min-w-[350px] sm:w-auto max-w-xs mx-auto bg-baseColor text-white text-xl font-bold py-20 rounded hover:bg-hoverColor transition flex flex-col items-center justify-center"
          >
            <Image
              src={onsite}
              alt="Pay Onsite"
              className="w-24 h-24 mb-4"
            />
            Pay Onsite
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MemFee;
