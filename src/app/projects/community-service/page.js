"use client";


import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import officersPic from "../../../../public/static/officers.jpg";

export default function CommunityService() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state based on login status
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  return (
    <>
      <Image
        src={officersPic}
        className="fixed blur-sm bg-scroll object-cover opacity-10 h-[100vh] w-[100vw] z-[-10]"
        draggable={false}
      />
      <Nav />
      <div className="min-h-[80vh] border-2 border-dark-chocolate bg-dark-chocolate p-10 m-10 rounded-xl bg-opacity-30">
        <h1 className="text-3xl font-bold">Community Service</h1>
        {user ? (
          <p className="mt-3 text-lg">
            The Community Service Project is dedicated to creating a positive impact in our local area by taking on an issue and working toward a solution with project members.
          </p>
        ) : (
          <p className="mt-3 text-lg">
            The Community Service Project is dedicated to creating a positive impact in our local area by taking on an issue and working toward a solution with project members.
          </p>
        )}

      </div>
      <Footer />
    </>
  );
}