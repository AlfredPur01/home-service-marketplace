import { ConnectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await ConnectToDB();

    const data = await req.formData();

    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const file = data.get('profileImage');

    if (!file) {
      return NextResponse.json({ message: "No file upload" }, { status: 400 });
    }

    // Upload image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      }).end(buffer);
    });

    const profileImageUrl = uploadResult.secure_url;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User Already exists!" },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
    });

    // Save a new user
    await newUser.save();

    // Send a success message
    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Fail to create new User!" },
      { status: 500 }
    );
  }
}
