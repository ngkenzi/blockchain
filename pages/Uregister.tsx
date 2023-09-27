import { useState } from "react";
import axios from "axios";
import {
  Container,
  TextInput,
  Paper,
  Button,
  Text,
  Notification,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";

const URegister = () => {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    universityName: "",
  });
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const registerUser = async () => {
    try {
      const response = await axios.post("/api/Uregister", formData);
      setNotificationType("success");
      setMessage("User registered successfully");
      setNotificationVisible(true);
      setTimeout(() => {
        router.push({
          pathname: "/UConfirm",
          query: { email: formData.email },
        });
        setNotificationVisible(false);
      }, 2000);
    } catch (error) {
      setNotificationType("error");
      setMessage(error.response?.data?.message || "Registration failed.");
      setNotificationVisible(true);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      <Container className="w-full sm:w-1/3 md:w-2/4 lg:w-1/3 xl:w-1/3 2xl:w-1/3 p-8 rounded-lg bg-gray-300">
        <div className="shadow-lg ">
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
              User Registration
            </Text>
            <TextInput
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: 30 }}
              label="Email"
              required
            />
            <TextInput
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={{ marginBottom: 30 }}
              label="Password"
              required
            />
            <TextInput
              placeholder="University Name"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              style={{ marginBottom: 40 }}
              label="University Name"
              required
            />
            <Button
              onClick={registerUser}
              fullWidth
              style={{ marginBottom: "2rem" }}
            >
              Register
            </Button>
            {notificationVisible && message && (
              <Notification
                style={{ marginTop: "2rem" }}
                color={notificationType}
                onClose={() => setNotificationVisible(false)}
              >
                {message}
              </Notification>
            )}
            <Text align="center" size="sm" style={{ marginTop: "2rem" }}>
              Already have an account?{" "}
              <Link
                href="/Ulogin"
                style={{ color: theme.colors[theme.primaryColor][6] }}
              >
                Login
              </Link>
            </Text>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default URegister;
