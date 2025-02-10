"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Spinner } from "../_components/Spinner";
import Header from "../_components/Header";
import toast, { Toaster } from "react-hot-toast";
import ServiceForm from "../_service/ServiceForm";

const UpdateService = () => {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState({
    category: "",
    title: "",
    address: "",
    contact: "",
    description: "",
    creator: "",
    photos: [],
  });

  const router = useRouter();

  useEffect(() => {
    const getServiceDetails = async () => {
      try {
        const response = await axios.get(`/api/service/${serviceId}`);
        const data = response.data;

        setService({
          title: data.title,
          category: data.category,
          address: data.address,
          available: data.available,
          contact: data.contact,
          description: data.description,
          photos: data.servicePhoto,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setLoading(false);
      }
    };
    if (serviceId) {
      getServiceDetails();
    }
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateFormService = new FormData();

      for (const key in service) {
        if (key === "photos") {
          service.photos.forEach((photo) => {
            updateFormService.append("servicePhoto", photo);
          });
        } else {
          updateFormService.append(key, service[key]);
        }
      }

      const response = await axios.patch(
        `/api/service/${serviceId}`,
        updateFormService
      );
      if (response.status === 200) {
        toast.success("Service updated successfully!", {
          position: "top-right",
        });
        router.push('/');
      }
    } catch (error) {
      console.error("Error updating service:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      } else {
        toast.error("Update service failed", {
          position: "top-right",
        });
      }
    }
  };

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
      <Spinner />
    </div>
  ) : (
    <>
      <Header />
      <Toaster />
      <ServiceForm
        service={service}
        setService={setService}
        type="Edit"
        handleSubmit={handleSubmit}
      />
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <UpdateService />
    </Suspense>
  );
};

export default Page;
