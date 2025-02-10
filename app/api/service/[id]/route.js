import Service from "@/models/Service";
import { ConnectToDB } from "@/mongodb/database";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const service = await Service.findById(params.id).populate("creator");
    if (!service) return new Response("The Service is not Found", { status: 404 });

    return new Response(JSON.stringify(service), { status: 200 });
  } catch (err) {
    console.error("GET Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await ConnectToDB();

    const data = await req.formData();

    // Extract data fields
    const title = data.get("title");
    const category = data.get("category");
    const address = data.get("address");
    const available = data.get("available");
    const contact = data.get("contact");
    const description = data.get("description");

    // Get an array of uploaded photos
    const photos = data.getAll("servicePhoto");
    const servicePhotos = [];

    // Process and store each photo
    for (const photo of photos) {
      if (photo instanceof File) {
        // Read the photo as an array buffer
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary and get the secure URL
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          }).end(buffer);
        });

        // Collect the secure URL
        servicePhotos.push(uploadResult.secure_url);
      } else {
        // if it's an old photo
        servicePhotos.push(photo);
      }
    }

    // Find the existing service
    const existingService = await Service.findById(params.id);

    if (!existingService) {
      return new Response("The Service is not Found", { status: 404 });
    }

    // Update the Service with the new data
    existingService.title = title;
    existingService.category = category;
    existingService.address = address;
    existingService.available = available;
    existingService.contact = contact;
    existingService.description = description;
    existingService.servicePhotos = servicePhotos;

    await existingService.save();

    return new Response("Successfully updated the Service", { status: 200 });
  } catch (err) {
    console.error("PATCH Error:", err);
    return new Response("Error updating the service", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await ConnectToDB();
    await Service.findByIdAndDelete(params.id);

    return new Response("Successfully deleted the Service", { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return new Response("Error deleting the service", { status: 500 });
  }
};