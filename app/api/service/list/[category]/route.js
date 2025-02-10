import Service from "@/models/Service";
import { ConnectToDB } from "@/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const category = params.category; // Correctly extract the category parameter

    let serviceList;

    if (category !== "All") {
      serviceList = await Service.find({ category }).populate("creator");
    } else {
      serviceList = await Service.find().populate("creator");
    }

    return new Response(JSON.stringify(serviceList), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch service", { status: 500 });
  }
};
