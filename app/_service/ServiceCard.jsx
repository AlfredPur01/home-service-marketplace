import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPinIcon, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";

const ServiceCard = ({ service }) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/service/${service._id}`);
      setShowDialog(false);
      toast.success("Service has been deleted successfully!");
      router.reload();
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  return (
    <div className="relative shadow-md rounded-sm hover:shadow-lg cursor-pointer hover:shadow-blue-200 hover:scale-105 transition-all ease-in-out">
      {service.creator._id === userId && (
        <AlertDialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
          <AlertDialogTrigger asChild>
            <Button
              className="absolute top-2 right-2  shadow-md hover:bg-red-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent div
                setShowDialog(true);
              }}
            >
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this service?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              This action cannot be undone. Deleting the service will remove it
              permanently.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div
        onClick={() => {
          router.push(`service-details?id=${service._id}`);
        }}
      >
        {/* Service photo */}
        {service.servicePhoto && service.servicePhoto.length > 0 && (
          <img
            src={service.servicePhoto[0]}
            alt={service.title}
            width={500}
            height={200}
            className="h-[150px] md:h-[200px] object-cover rounded-lg"
          />
        )}

        {/* Service details */}
        <div className="flex flex-col items-baseline p-3 gap-1">
          {/* Service category */}
          <h2 className="p-1 bg-purple-200 text-primary rounded-full px-2 text-[12px]">
            {service.category}
          </h2>
          {/* Service title */}
          <h2 className="font-bold text-lg">{service.title}</h2>
          {/* Creator information */}
          <div className="flex items-center justify-center gap-2">
            <Avatar className="h-6 w-6 cursor-pointer">
              {service.creator.profileImage ? (
                <AvatarImage
                  src={service.creator.profileImage}
                  alt={service.creator.username}
                />
              ) : (
                <AvatarFallback>
                  {service.creator.username &&
                  service.creator.username.length > 0
                    ? service.creator.username[0].toUpperCase()
                    : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-primary font-medium mb-4">
              {service.creator.username}
            </h2>
          </div>
          {/* Service address */}
          <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {service.address}
              </span>
            </div>          {/* Book Now button */}
          {service.creator._id !== userId && (
            <Button className="bg-red-500 mt-2 hover:bg-red-600">
              Book Now
            </Button>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
