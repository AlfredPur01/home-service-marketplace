import Service from "@/models/Service";
import { ConnectToDB } from "@/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const { query } = params; // Destructure the query parameter from params

    let services = [];

    if (query === "all") {
      services = await Service.find().populate("creator");
    } else {
      services = await Service.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
        ],
      }).populate("creator");
    }

    if (services.length === 0) return new Response("No services found", { status: 404 });

    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
};
