import { useState, useEffect } from "react";
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
import { BeatLoader } from "react-spinners";
import { IoEyeOff, IoEye } from "react-icons/io5";

const URegister = () => {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    universityName: "",
    FirstName: "",
    LastName: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [inviteType, setInviteType] = useState("info");
  const [inviteVisible, setInviteVisible] = useState(false);
  const [universities, setUniversities] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cvFile, setCvFile] = useState(null);

  // Function to toggle show/hide password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Check if all required fields are filled and passwords match and are of minimum length
  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.universityName &&
      formData.FirstName &&
      formData.LastName &&
      formData.password === confirmPassword &&
      formData.password.length >= 8
    );
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("/api/universities");
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const registerUser = async () => {
    setLoading(true);

    try {
      let cvUrl = "N/A";
      let CVFreeJobTokenStatus = 0;

      if (cvFile) {
        const formData = new FormData();
        formData.append("cv", cvFile);

        // Upload the CV file and get the URL
        const uploadResponse = await axios.post("/api/upload-cv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        cvUrl = uploadResponse.data.fileUrl;
        CVFreeJobTokenStatus = 1;
      }

      const fullData = {
        ...formData,
        cvUrl,
        CVFreeJobTokenStatus,
      };

      const response = await axios.post("/api/Uregister", formData);
      setInviteType("success");
      setMessage("User registered successfully");
      setInviteVisible(true);
      setTimeout(() => {
        router.push({
          pathname: "/user/confirm",
          query: { email: formData.email },
        });
        setInviteVisible(false);
      }, 2000);
    } catch (error) {
      setInviteType("error");
      setMessage(error.response?.data?.message || "Registration failed.");
      setInviteVisible(true);
      setLoading(false);
    } finally {
    }
  };

  const PasswordInputRightIcon = () => (
    <div onClick={toggleShowPassword} style={{ cursor: "pointer" }}>
      {showPassword ? <IoEyeOff size="1.5em" /> : <IoEye size="1.5em" />}
    </div>
  );

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center">
      {loading ? ( // Conditional rendering based on loading state
        <BeatLoader color="#333" /> // Show loader when loading
      ) : (
        <Container className="w-full sm:w-2/4 md:w-2/4 lg:w-1/3 xl:w-1/3 2xl:w-1/3 p-8 rounded-lg bg-gray-300">
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

              <div className="flex space-x-4 mb-4">
                <TextInput
                  placeholder="First Name"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                  label="First Name"
                  required
                />
                <TextInput
                  placeholder="Last Name"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                  label="Last Name"
                  required
                />
              </div>

              <TextInput
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ marginBottom: 30 }}
                label="Email"
                required
              />

              <div className="mb-4 relative">
                <TextInput
                  placeholder="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  label="Password"
                  required
                  rightSection={PasswordInputRightIcon()} // Set the icon as the right section of the input
                  rightSectionWidth={40} // Adjust width as needed
                  style={{ marginBottom: 30 }}
                />
              </div>

              <TextInput
                placeholder="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"} // Match the type with password field
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                required
                rightSection={PasswordInputRightIcon()} // Set the icon as the right section of the input
                rightSectionWidth={40} // Adjust width as needed
                style={{ marginBottom: 30 }}
              />

              <TextInput
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                label="Upload CV (PDF only)"
              />

              <select
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                style={{
                  marginBottom: 40,
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                }}
                required
              >
                <option value="" disabled>
                  Select your university
                </option>
                {universities.map((university, index) => (
                  <option key={index} value={university.university_name}>
                    {university.university_name}
                  </option>
                ))}
              </select>
              <Button
                onClick={registerUser}
                fullWidth
                disabled={!isFormValid()}
                style={{ marginBottom: "2rem" }}
              >
                Register
              </Button>
              {inviteVisible && message && (
                <Notification
                  style={{ marginTop: "2rem" }}
                  color={inviteType}
                  onClose={() => setInviteVisible(false)}
                >
                  {message}
                </Notification>
              )}
              <Text align="center" size="sm" style={{ marginTop: "2rem" }}>
                Already have an account?{" "}
                <Link
                  href="/user/login"
                  style={{ color: theme.colors[theme.primaryColor][6] }}
                >
                  Login
                </Link>
                <p className="mt-2">
                  <Link href="/" className="text-blue-600 underline">
                    Navigate back to home
                  </Link>
                </p>
              </Text>
            </Paper>
          </div>
        </Container>
      )}
    </div>
  );
};

export default URegister;
