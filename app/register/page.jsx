"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import ButtonSpinner from "../_components/ButtonSpinner";

const RegisterPage = () => {
  const router = useRouter();
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("profileImage", formData.profileImage);

    try {
      const response = await axios.post("/api/register", form);
      console.log(response.data);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      } else {
        toast.error("Failed to register. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/" })
      .catch((err) => {
        toast.error("Something went wrong. Please try again!");
        console.log(err);
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Create your account
          </h2>
          {/* <p className="text-gray-600 text-center mb-6">
            authentication for the Web, sign up with google
          </p> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="username"
              >
                Username
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <Label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <Label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <Label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="image"
              >
                Upload Image
              </Label>
              <Input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
              />
            </div>
            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="image"
                className="w-full h-20 object-contain"
              />
            )}
            <div>
              <Button type="submit" className="w-full">
              {signupLoading && (
                <ButtonSpinner />
              )}Register
              </Button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-2">Or sign up with:</p>
            <Button
              onClick={handleGoogleSignUp}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {googleLoading && (
                <ButtonSpinner />
              )}
              Sign Up with Google
            </Button>
            <p className="text-gray-600 mt-2">
              Already have an account <Link href="/login" classname="hover:scale-105 hover:text-red-500 cursor-pointer">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;



