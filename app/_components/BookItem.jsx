import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const BookingItem = ({ booking, onCancelBooking }) => {
  const { service } = booking;

  if (!service) {
    return null;
  }

  const handleCancel = () => {
    onCancelBooking(booking);
  };

  return (
    <Tabs defaultValue="booked" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="booked">Booked</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="booked">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="border rounded-lg p-4 mb-5 flex flex-col md:flex-row gap-4">
            {service.servicePhoto && service.servicePhoto.length > 0 && (
              <img
                src={service.servicePhoto[0]}
                alt={service.title}
                className="rounded-lg object-cover w-full h-auto md:w-[220px] md:h-[220px]"
              />
            )}

            <div className="flex flex-col gap-2">
              <h2 className="font-bold">{service.title}</h2>
              <h2 className="flex gap-2 text-primary">
                <User /> {service.creator.username}
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <MapPin className="text-primary" /> {service.address}
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <Calendar className="text-primary" />
                Service on :
                <span className="text-black">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <Clock className="text-primary" />
                Service time:
                <span className="text-black"> {booking.timeSlot}</span>
              </h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-5 w-full border-red-300"
                  >
                    Cancel Booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently
                      delete your booking and remove your data from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BookingItem;
