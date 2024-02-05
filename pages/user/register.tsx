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
  Grid,
  Select,
  Skeleton,
  FileInput,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { IconFileCv } from "@tabler/icons-react";

const URegister = () => {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    universityName: "",
    FirstName: "",
    LastName: "",
  });

  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

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
    <>
      <section style={{ display: "flex", fontFamily: "Kanit, sans-serif" }}>
        <div style={{ height: "100vh", width: "70%" }}>
          <img
            src="/assets/register_bg.jpg"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            padding: "50px",
          }}
        >
          <a href="/" style={{ textDecoration: "none", display: "inline" }}>
            <img
              src="/images/logo.png"
              style={{ width: "40px", height: "50px", marginBottom: "30px" }}
            />
          </a>
          <p
            style={{
              fontSize: "30px",
              opacity: "67%",
            }}
          >
            Create an account
          </p>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="First name"
                value={formData.FirstName}
                onChange={handleChange}
                name="FirstName"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last name"
                value={formData.LastName}
                onChange={handleChange}
                name="LastName"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email address"
                value={formData.LastName}
                onChange={handleChange}
                name="email"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                label="Password"
                required
                rightSection={PasswordInputRightIcon()}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                placeholder="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                required
                rightSection={PasswordInputRightIcon()}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                label="Upload CV (PDF only)"
              />
              <FileInput
                rightSection={icon}
                label="Attach your CV"
                placeholder="Your CV"
                rightSectionPointerEvents="none"
                mt="md"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select
                label="Select your university"
                placeholder="Select your university"
                name="universityName"
                value={formData.universityName}
                onChange={(value) =>
                  setFormData({ ...formData, universityName: value })
                }
                data={universities.map((university) => ({
                  value: university.university_name,
                  label: university.university_name,
                }))}
                required
                style={{
                  marginBottom: 40,
                }}
              />
            </Grid.Col>
          </Grid>
        </div>
      </section>
    </>
  );
};

export default URegister;
