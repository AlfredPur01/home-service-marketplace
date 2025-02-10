import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

const ServiceList = ({ services }) => {
  const [shuffledServices, setShuffledServices] = useState([]);

  useEffect(() => {
    if (services) {
      setShuffledServices(shuffleArray(services));
    }
  }, [services]);
  return (
    <div>
      {services && services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
          {shuffledServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default ServiceList;