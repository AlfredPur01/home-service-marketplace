"use client";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Hero from "./_components/Hero";
import CategoriesList from "./_service/CategoriesList";
import { Spinner } from "./_components/Spinner";

const Page = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to the login page if not authenticated
    } else {
      setIsLoading(false); // Set loading to false once authentication status is resolved
    }
  }, [status, router]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
          <Spinner />
        </div>
      ) : (
        <div>
          <Header />
          <Hero />
          <CategoriesList />
        </div>
      )}
    </>
  );
};

export default Page;