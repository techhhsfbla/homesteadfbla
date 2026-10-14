"use client";


import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import officersPic from "../../../../public/static/officers.jpg";
import csCommittee from "../../../../public/static/cs-committee.jpg";

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

        <div className = "mt-8 p-6 bg-white bg-opacity-5 rounded-xl border border-white/10 max-w-md mx-auto md:mx-0">
          <div className="flex justify-between items-center mb-4 gap-2">
            <h2 className = "text-xl font-bold text-watermelon-red"> Social Media Committee</h2>
            <span className = "bg-watermelon-red/20 text-watermelon-red text-xs font-semibold px-3 py-1 rounded-full border border-watermelon-red/30 whitespace-nowrap">
              Applications due 10/17
            </span>
          </div>

          <div className = "relative w-full rounded-lg overflow-hidden my-4">
            <Image
              src={csCommittee}
              alt = "Social Media Committee Flyer"
              className = "w-full h-auto rounded-lg object-contain"
              draggable = {false}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}