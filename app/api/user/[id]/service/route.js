import Service from "@/models/Service";
import User from "@/models/User";
import { ConnectToDB } from "@/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await ConnectToDB();

    const user = await User.findById(params.id);
    const serviceList = await Service.find({ creator: params.id }).populate("creator");

    user.services = serviceList;
    await user.save();

    return new Response(JSON.stringify({ user: user, serviceList: serviceList }), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch work list by user", { status: 500 })
  }
}