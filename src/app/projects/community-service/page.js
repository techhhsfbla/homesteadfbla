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
            This year’s CS project is focused on supporting underrepresented arts in the Bay Area! We want to raise appreciation for the arts while providing students more opportunities to be creative, through initiatives such as painting a mural at a local school, creating a short film on art and its importance, hosting a multi-media night at Homestead in collaboration with different art clubs on campus, and more! Make sure to follow our project Instagram, as well as our supplemental account where we feature interviews with local artists every week!
          </p>
        ) : (
          <p className="mt-3 text-lg">
            This year’s CS project is focused on supporting underrepresented arts in the Bay Area! We want to raise appreciation for the arts while providing students more opportunities to be creative, through initiatives such as painting a mural at a local school, creating a short film on art and its importance, hosting a multi-media night at Homestead in collaboration with different art clubs on campus, and more! Make sure to follow our project Instagram, as well as our supplemental account where we feature interviews with local artists every week!
          </p>
        )}

      </div>
      <Footer />
    </>
  );
}