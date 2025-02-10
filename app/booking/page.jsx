"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Spinner } from "../_components/Spinner";
import Header from "../_components/Header";
import BookingItem from "../_components/BookItem";
import toast from "react-hot-toast";

const Booking = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/user/${userId}/booking`);
        setBookings(response.data);
        
      } catch (error) {
        toast.error("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const handleCancelBooking = async (booking) => {
    try {
      const response = await axios.delete(`/api/user/${userId}/booking`, {
        data: booking,
      });
      if (response.status === 200) {
        toast.success("Booking cancelled successfully.");
        setBookings(response.data);
        window.location.reload(); 
      } 
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again later.");
    }
  };

  if (status === "loading" || loading) return <Spinner />;

  return (
    <>
      <Header />
      <div className="my-10 mx-5 md:mx-24">
        <h2 className="font-bold text-[20px] my-2">My Bookings</h2>
        {bookings.length > 0 ? (
          <>
            {bookings.map((booking) => (
              <BookingItem
                key={booking._id}
                booking={booking}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </>
  );
};

export default Booking;
