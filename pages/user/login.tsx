import { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextInput, Paper, Button, Text } from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

const login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const loginUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/Ulogin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("walletAddress", response.data.walletAddress);
        localStorage.setItem("FirstName", response.data.FirstName);
        localStorage.setItem("LastName", response.data.LastName);

        setMessage("Signed in successfully.");
        router.push("/user/profile");
      } else {
        setMessage("Login failed.");
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : "Login failed.");
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <div
      className="flex min-h-screen flex-1"
      style={{ fontFamily: "Kanit, sans-serif" }}
    >
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/LoginPicture.webp"
          alt=""
        />
      </div>

      {/* Login Form Section (1/3 of the screen) */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-24 w-18" src="/images/logo.png" alt="Beingu" />
            <h2
              className="my-8 text-3xl font-medium tracking-normal text-left"
              style={{ color: "#000000AB" }}
            >
              Sign in to your account
            </h2>
          </div>

          <form onSubmit={loginUser} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email:
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password:
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mb-10 block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-4">
            {message}
            <div className="mt-4">
              Don't have an account?{" "}
              <a
                href="/user/register"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
