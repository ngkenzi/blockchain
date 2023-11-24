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
        localStorage.setItem("walletAddress", response.data.walletAddress);
        localStorage.setItem("FirstName", response.data.FirstName);
        localStorage.setItem("LastName", response.data.LastName);

        setMessage("Logged in successfully.");
        router.push("/user/profile");
      } else {
        setMessage("Login failed.");
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center">
      {isLoading ? (
        <BeatLoader color="#333" />
      ) : (
        <Container className="w-full sm:w-1/3 md:w-2/4 lg:w-1/3 xl:w-1/3 2xl:w-1/3 p-8 rounded-lg">
          <div className="shadow-lg">
            <Paper
              padding="xl"
              style={{
                margin: "8rem 0",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                align="center"
                size="xl"
                style={{ marginBottom: "3rem", fontWeight: 600 }}
              >
                User Login
              </Text>
              <form onSubmit={loginUser}>
                <TextInput
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ marginBottom: 30 }}
                />
                <TextInput
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ marginBottom: 40 }}
                />
                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
              <Text align="center" size="sm" style={{ marginTop: "2rem" }}>
                {message}
              </Text>
              <Text align="center" size="sm" style={{ marginTop: "1rem" }}>
                Don't have an account?{" "}
                <Link href="/user/register" style={{ color: "blue" }}>
                  Register
                </Link>
              </Text>
            </Paper>
          </div>
        </Container>
      )}
    </div>
  );
};

export default login;
