"use client";
import axios from "axios";
import Header from "@/app/_components/Header";
import ServiceList from "@/app/_service/ServiceList";
import { Spinner } from "@/app/_components/Spinner";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchPage = () => {
  const { query } = useParams(); // Use useParams to get the dynamic query
  const [loading, setLoading] = useState(true);
  const [serviceList, setServiceList] = useState([]);

  const getServiceList = async () => {
    try {
      const response = await axios.get(`/api/service/search/${query}`); // Adjust the API endpoint
      setServiceList(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      getServiceList();
    }
  }, [query]);

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
      <Spinner />
    </div>
  ) : (
    <>
      <Header />
      {serviceList.length > 0 ? (
        <div className="container mx-auto px-6 py-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-[22px]">All results</h2>
          <ServiceList services={serviceList} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p>No services found.</p>
        </div>
      )}
    </>
  );
};

export default SearchPage;
