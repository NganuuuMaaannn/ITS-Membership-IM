import React from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminIndex = () => {
  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (user) {
      if(user.role == 'admin') {
        router.push("/adminAttendance");
      } 
      else if(user.role == 'student'){
        router.push("/userDash");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <></>
  );
};

export default AdminIndex;
