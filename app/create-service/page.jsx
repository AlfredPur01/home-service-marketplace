"use client";
import React, { useEffect, useState } from "react";
import ServiceForm from "@/app/_service/ServiceForm";
import Header from "../_components/Header";
import { Spinner } from "../_components/Spinner";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); 
    } else {
      setIsLoading(false);
    }
  }, [status, router]);

  const [service, setService] = useState({
    creator: "",
    title: "",
    category: "",
    address: "",
    available: "",
    contact: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    if (session && session.user) {
      const userId = session.user.id;
      setService((prevService) => ({
        ...prevService,
        creator: userId,
      }));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newServiceForm = new FormData();

      for (const key in service) {
        if (key === "photos") {
          service.photos.forEach((photo) => {
            newServiceForm.append("servicePhoto", photo);
          });
        } else {
          newServiceForm.append(key, service[key]);
        }
      }

      const response = await axios.post("/api/service/new", newServiceForm);

      if (response.status === 201) {
        toast.success("Service created successfully!", {
          position: "top-right",
        });
        router.push(`/service?id=${service.creator}`);
      } else {
        toast.error("Failed to create service. Please try again.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Publish service failed";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
          <Spinner />
        </div>
      ) : (
        <>
          <Header />
          <ServiceForm
            service={service}
            setService={setService}
            type="create"
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export default Page;
