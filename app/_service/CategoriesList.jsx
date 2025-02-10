import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data";
import ServiceList from "./ServiceList";
import axios from "axios";
import { Spinner } from "../_components/Spinner";

const CategoriesList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchServices = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/service/list/${category}`);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-10">
      <div className="flex flex-wrap justify-center space-x-4 mb-5">
        <Button
          className={`mb-4 font-semibold ${
            selectedCategory === "All"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.value}
            className={`font-semibold mb-5 ${
              selectedCategory === category.value
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="font-bold text-[22px]">All Services</h2>
          <ServiceList services={services} />
        </>
      )}
    </div>
  );
};

export default CategoriesList;
