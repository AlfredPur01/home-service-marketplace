"use client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Spinner } from "../_components/Spinner";
import Header from "../_components/Header";
import ServiceList from "../_service/ServiceList";

const ServiceContent = () => {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [serviceList, setServiceList] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}/service`);
        setServiceList(response.data.serviceList);
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service list:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchServiceList();
    }
  }, [userId]);

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
      <Spinner />
    </div>
  ) : (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center  space-x-4 mb-8">
          {loggedInUserId && loggedInUserId === userId ? (
            <h1 className="font-bold text-[22px]">Your Services</h1>
          ) : (
            <h1 className="ml-6">{user.username} Services</h1>
          )}
          <ServiceList services={serviceList} />
        </div>
      </div>
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ServiceContent />
    </Suspense>
  );
};

export default Page;
