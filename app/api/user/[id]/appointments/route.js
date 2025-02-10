import User from "@/models/User";
import Service from "@/models/Service";
import { ConnectToDB } from "@/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const user = await User.findById(params.id).populate("appointments.serviceId");
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const appointments = await Promise.all(
      user.appointments.map(async (appointment) => {
        try {
          const service = await Service.findById(appointment.serviceId).populate("creator");
          if (!service) {
            return null;
          }

          return {
            _id: appointment._id,
            service: {
              _id: service._id,
              title: service.title,
              category: service.category,
              address: service.address,
              available: service.available,
              contact: service.contact,
              description: service.description,
              servicePhoto: service.servicePhoto,
              creator: {
                _id: service.creator._id,
                username: service.creator.username,
                email: service.creator.email,
                profileImage: service.creator.profileImage,
              },
            },
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            name: appointment.name,
            contact: appointment.contact,
          };
        } catch (error) {
          return null;
        }
      })
    );

    const filteredAppointments = appointments.filter((appointment) => appointment !== null);

    return new Response(JSON.stringify(filteredAppointments), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch appointments: ${error.message}`, {
      status: 500 },
    );
  }
};

export const DELETE = async (req, { params }) => {
  try {
    
    await ConnectToDB();

    const body = await req.json();
    const { service, date, timeSlot, name, contact } = body;

    const user = await User.findById(params.id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const index = user.appointments.findIndex(
      (appointment) =>
        appointment.serviceId.toString() === service._id.toString() &&
        new Date(booking.date).toISOString() === new Date(date).toISOString() &&
        appointment.timeSlot === timeSlot &&
        appointment.name === name &&
        appointment.contact === contact
    );
    if (index === -1) {
      return new Response("Booking not found", { status: 404 });
    }

    user.appointments.splice(index, 1);
    await user.save();

    return new Response(JSON.stringify(user.bookings), { status: 200 });
  } catch (error) {
    return new Response(`Failed to cancel appointment: ${error.message}`, {
      status: 500,
    });
  }
};
  