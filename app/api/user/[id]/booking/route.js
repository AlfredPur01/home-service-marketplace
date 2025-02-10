import User from "@/models/User";
import Service from "@/models/Service";
import { ConnectToDB } from "@/mongodb/database";

export const POST = async (req, { params }) => {
  try {
    const booking = await req.json();
    await ConnectToDB();

    const user = await User.findById(params.id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const service = await Service.findById(booking.serviceId);
    if (!service) {
      return new Response("Service not found", { status: 404 });
    }

    // Add booking to user's bookings array
    user.bookings.push({
      serviceId: booking.serviceId,
      date: booking.date,
      timeSlot: booking.timeSlot,
      name: booking.name,
      contact: booking.contact,
    });

    await user.save();

    // Add booking to service creator's appointments array
    const serviceCreator = await User.findById(service.creator._id);
    if (!serviceCreator) {
      return new Response("Service creator not found", { status: 404 });
    }

    serviceCreator.appointments.push({
      serviceId: booking.serviceId,
      date: booking.date,
      timeSlot: booking.timeSlot,
      name: booking.name,
      contact: booking.contact,
    });
    await serviceCreator.save();

    return new Response(JSON.stringify(user.bookings), { status: 200 });
  } catch (error) {
    return new Response(`Failed to update booking: ${error.message}`, {
      status: 500,
    });
  }
};

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const user = await User.findById(params.id).populate("bookings.serviceId");
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const bookings = await Promise.all(
      user.bookings.map(async (booking) => {
        try {
          const service = await Service.findById(booking.serviceId).populate(
            "creator"
          );
          if (!service) {
            return null;
          }

          return {
            _id: booking._id,
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
            date: booking.date,
            timeSlot: booking.timeSlot,
            name: booking.name,
            contact: booking.contact,
          };
        } catch (error) {
          return null;
        }
      })
    );

    const filteredBookings = bookings.filter((booking) => booking !== null);

    return new Response(JSON.stringify(filteredBookings), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch bookings: ${error.message}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await ConnectToDB();

    const body = await req.json();
    const { service, date, timeSlot, name, contact } = body;

    const userId = params.id;

    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const index = user.bookings.findIndex(
      (booking) =>
        booking.serviceId.toString() === service._id.toString() &&
        new Date(booking.date).toISOString() === new Date(date).toISOString() &&
        booking.timeSlot === timeSlot &&
        booking.name === name &&
        booking.contact === contact
    );

    if (index === -1) {
      return new Response("Booking not found", { status: 404 });
    }

    user.bookings.splice(index, 1);
    await user.save();

    // Also remove the appointment from the service creator's appointments
    const serviceData = await Service.findById(service._id);
    if (!serviceData) {
      return new Response("Service not found", { status: 404 });
    }

    const creator = await User.findById(serviceData.creator);
    if (!creator) {
      return new Response("Service creator not found", { status: 404 });
    }

    const appointmentIndex = creator.appointments.findIndex(
      (appointment) =>
        appointment.serviceId.toString() === service._id &&
        new Date(appointment.date).toISOString() ===
          new Date(date).toISOString() &&
        appointment.timeSlot === timeSlot &&
        appointment.name === name &&
        appointment.contact === contact
    );

    if (appointmentIndex !== -1) {
      creator.appointments.splice(appointmentIndex, 1);
      await creator.save();
    }

    return new Response(JSON.stringify(user.bookings), { status: 200 });
  } catch (error) {
    return new Response(`Failed to delete booking: ${error.message}`, {
      status: 500,
    });
  }
};
