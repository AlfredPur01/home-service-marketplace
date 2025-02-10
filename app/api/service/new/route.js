import { ConnectToDB } from "@/mongodb/database";
import Service from "@/models/Service";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Connect to MongoDB
    await ConnectToDB();

    // Get form data
    const data = await req.formData();

    // Extract data fields
    const creator = data.get("creator");
    const title = data.get("title");
    const address = data.get("address");
    const available = data.get("available");
    const contact = data.get("contact");
    const category = data.get("category");
    const description = data.get("description");

    // Get an array of uploaded photos
    const photos = data.getAll("servicePhoto");
    const servicePhotos = [];

    // Process and store each photo
    for (const photo of photos) {
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
    }

    // Create new service document
    const newService = new Service({
      creator,
      title,
      category,
      address,
      available,
      contact,
      description,
      servicePhoto: servicePhotos,
    });

    // Save the service document to MongoDB
    await newService.save();

    return new Response(JSON.stringify(newService), {
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
