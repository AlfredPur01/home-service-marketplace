import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Contact, User } from "lucide-react";
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


const AppointmentContent = ({ appointment, onCancelAppointment }) => {
  const { service } = appointment;

  if (!service) {
    return null;
  }

  const handleCancel = () => {
    onCancelAppointment(appointment);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="border rounded-lg p-4 mb-5">
        <div className="flex gap-4">
          {service.servicePhoto && service.servicePhoto.length > 0 && (
            <img
              src={service.servicePhoto[0]}
              alt={service.title}
              className="rounded-lg object-cover w-[220px] h-[220px]"
            />
          )}

          <div className="flex flex-col gap-2">
            <h2 className="font-bold">{service.title}</h2>
            <h2 className="flex gap-2 text-gray-500">
              <User className="text-primary" />
              Customer :
              <span className="text-black">{appointment.name}</span>
            </h2>
            <h2 className="flex gap-2 text-gray-500">
              <Calendar className="text-primary" />
              Service on :
              <span className="text-black">
                {new Date(appointment.date).toLocaleDateString()}
              </span>
            </h2>
            <h2 className="flex gap-2 text-gray-500">
              <Clock className="text-primary" />
              Service on :
              <span className="text-black">{appointment.timeSlot}</span>
            </h2>
            <h2 className="flex gap-2 text-gray-500">
              <Contact className="text-primary" />
              Contact :
              <span className="text-black">{appointment.contact}</span>
            </h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-5 w-full border-red-300"
                >
                  Cancel Appointment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your appointment and remove your data from our servers.
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
    </div>
  );
};

const AppointmentItem = ({ appointment, onCancelAppointment }) => {
  return (
    <Tabs defaultValue="booked" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="booked">Appointment</TabsTrigger>
      </TabsList>
      <TabsContent value="booked">
          <AppointmentContent
            appointment={appointment}
            onCancelAppointment={onCancelAppointment}
          />
        
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentItem;
