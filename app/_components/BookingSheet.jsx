import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const CalendarDemo = ({ date, setDate }) => {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
};

const BookingSheet = ({ isSheetOpen, setIsSheetOpen }) => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const handleTimeSlotSelect = (time) => {
    setTimeSlot(time);
  };

  const handleSubmit = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const newBookingItem = {
      serviceId,
      date,
      timeSlot,
      name,
      contact,
    };

    try {
      const response = await axios.post(`/api/user/${userId}/booking`, newBookingItem);
      toast.success("Booking saved successfully.");
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to save booking. Please try again later.");
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="hidden">Open</Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Book a Service</SheetTitle>
          <SheetDescription>
            Schedule your home service appointment. Choose a date and a suitable time slot.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input 
              id="contact" 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className='flex flex-col gap-5 items-baseline'>
            <h2 className='mt-5 font-bold'>Select Date</h2>
            <div className="col-span-3">
              <CalendarDemo date={date} setDate={setDate} />
            </div>
          </div>
          <h2 className='my-1 font-bold'>Select Time Slot</h2>
          <div className='grid grid-cols-3 gap-3'>
            <div className="col-span-3 flex flex-wrap gap-2">
              {["7:00am", "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm"].map((time) => (
                <Button 
                  variant={timeSlot === time ? "solid" : "outline"} 
                  key={time} 
                  onClick={() => handleTimeSlotSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSubmit}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookingSheet;
