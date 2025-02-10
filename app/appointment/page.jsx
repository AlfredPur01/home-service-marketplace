"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Spinner } from "../_components/Spinner";
import Header from "../_components/Header";
import AppointmentItem from "../_components/AppointmentItem";
import toast from "react-hot-toast";

const Appointments = () => {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/user/${userId}/appointments`);
        setAppointments(response.data);
      } catch (error) {
        toast.error("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  const handleCancelAppointment = async (appointment) => {
    try {
      const response = await axios.delete(`/api/user/${userId}/appointments`, {
        data: appointment,
      });
      if (response.status === 200) {
        toast.success("Appointment cancelled successfully.");
        setAppointments(response.data);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to cancel appointment. Please try again later.");
    }
  };

  if (status === "loading" || loading) return <Spinner />;

  return (
    <>
      <Header />
      <div className="my-10 mx-5 md:mx-24">
        <h2 className="font-bold text-[20px] my-2">My Appointments</h2>
        {appointments.length > 0 ? (
          <>
            {appointments.map((appointment) => (
              <AppointmentItem
                key={appointment._id}
                appointment={appointment}
                onCancelAppointment={handleCancelAppointment}
              />
            ))}
          </>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </>
  );
};

export default Appointments;
