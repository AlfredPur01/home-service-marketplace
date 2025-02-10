"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense  } from "react";
import { Spinner } from "../_components/Spinner";
import { useSession } from "next-auth/react";
import Header from "../_components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MailIcon, ShareIcon, PhoneIcon, MapPinIcon, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import BookingSheet from "../_components/BookingSheet";
import toast from "react-hot-toast";
import ServiceCard from "../_service/ServiceCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ServiceDetail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [similarServices, setSimilarServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");

  useEffect(() => {
    const getServiceDetails = async () => {
      try {
        const response = await axios.get(`/api/service/${serviceId}`);
        const serviceData = response.data;
        setService(serviceData);
        fetchSimilarServices(serviceData.category, serviceData._id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setLoading(false);
      }
    };

    const fetchSimilarServices = async (category, currentServiceId) => {
      try {
        const response = await axios.get(`/api/service/list/${category}`);
        const filteredServices = response.data.filter(
          (service) => service._id !== currentServiceId
        );
        setSimilarServices(filteredServices);
      } catch (error) {
        console.error("Error fetching similar services:", error);
      }
    };

    if (serviceId) {
      getServiceDetails();
    }
  }, [serviceId]);

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL.");
      });
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
        <Spinner />
      </div>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const {
    servicePhoto = [],
    title,
    category,
    address,
    contact,
    description,
    creator,
  } = service;
  const mainImage =
    servicePhoto.length > 0 ? servicePhoto[0] : "/placeholder.svg";
  const galleryImages = servicePhoto.slice(1);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 max-w-[90vw] max-h-[90vh] overflow-auto">
          <img
            src={galleryImages[selectedImage]}
            alt={`Gallery Image ${selectedImage + 1}`}
            className="w-full rounded-lg object-cover"
          />
        </DialogContent>
      </Dialog>

      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="">
            <img
              src={mainImage}
              alt={title || "Home Service"}
              width={600}
              height={400}
              className="w-full h-[350px] rounded-lg object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2 flex-col">
              <span className="bg-gray-100 text-gray-900 px-4 py-1 rounded-full text-md font-medium dark:bg-gray-800 dark:text-gray-200">
                {category || "Home Services"}
              </span>
              <h1 className="text-2xl font-bold">{title || "Service Title"}</h1>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {address || "Service Address"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={creator.profileImage} />
                  <AvatarFallback>
                    {creator.username && creator.username.length > 0
                      ? creator.username[0].toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{creator.username}</div>
                </div>
              </div>
              
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {contact || "(555) 555-5555"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {creator?.email}
              </span>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={() => setIsSheetOpen(true)}>
                Book an Appointment
              </Button>
              {creator?._id === userId ? (
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    router.push(`/update-service?id=${serviceId}`);
                  }}
                >
                  <Edit className="w-5 h-5" />
                  Edit
                </Button>
              ) : (
                <Button
                  className="flex items-center gap-2"
                  onClick={handleShare}
                >
                  <ShareIcon className="w-5 h-5" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </section>
        <Separator className="my-8" />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">
              About {title || "the Service"}
            </h2>
            <div className="prose max-w-none">
              <p>{description || "Service description goes here."}</p>
            </div>
            {galleryImages.length > 0 && (
              <>
                <h2 className="text-2xl font-bold">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={image}
                          alt={`Gallery Image ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-full rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Similar Businesses</h2>
            <div className="grid grid-cols-1 gap-4">
              {similarServices.length > 0 ? (
                similarServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))
              ) : (
                <p>No similar businesses found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
      <BookingSheet isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ServiceDetail />
    </Suspense>
  );
};

export default Page;
