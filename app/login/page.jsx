"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ButtonSpinner from "../_components/ButtonSpinner";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (response.ok) {
        router.push("/");
      } else if (response.error) {
        toast.error(response.error || "Invalid email or password. Please try again!");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
      console.log(err);
    } finally {
      setLoginLoading(false);
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
            Login to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100"
                required
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center" disabled={loginLoading}>
              {loginLoading && (
                <ButtonSpinner />
              )}
              Login
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-2">Or sign up with:</p>
            <Button
              onClick={handleGoogleSignUp}
              className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              disabled={googleLoading}
            >
              {googleLoading && (
                <ButtonSpinner />
              )}
              Sign In with Google
            </Button>
            <p className="text-gray-600 mt-2">
              Create a new account?{" "}
              <Link
                href="/register"
                className="hover:scale-105 hover:text-red-500 cursor-pointer"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
