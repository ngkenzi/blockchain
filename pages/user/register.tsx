// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Container,
//   TextInput,
//   Paper,
//   Button,
//   Text,
//   Notification,
//   useMantineTheme,
//   Grid,
//   Select,
//   Skeleton,
//   FileInput,
//   rem,
// } from "@mantine/core";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { BeatLoader } from "react-spinners";
// import { IoEyeOff, IoEye } from "react-icons/io5";
// import { IconFileCv } from "@tabler/icons-react";

// const URegister = () => {
//   const theme = useMantineTheme();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     universityName: "",
//     FirstName: "",
//     LastName: "",
//   });

//   const icon = (
//     <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
//   );

//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState(null);
//   const [inviteType, setInviteType] = useState("info");
//   const [inviteVisible, setInviteVisible] = useState(false);
//   const [universities, setUniversities] = useState([]);

//   const [showPassword, setShowPassword] = useState(false);
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [cvFile, setCvFile] = useState(null);

//   // Function to toggle show/hide password
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   // Check if all required fields are filled and passwords match and are of minimum length
//   const isFormValid = () => {
//     return (
//       formData.email &&
//       formData.password &&
//       formData.universityName &&
//       formData.FirstName &&
//       formData.LastName &&
//       formData.password === confirmPassword &&
//       formData.password.length >= 8
//     );
//   };

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await axios.get("/api/universities");
//         setUniversities(response.data);
//       } catch (error) {
//         console.error("Error fetching universities", error);
//       }
//     };

//     fetchUniversities();
//   }, []);

//   const handleChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const registerUser = async () => {
//     setLoading(true);

//     try {
//       let cvUrl = "N/A";
//       let CVFreeJobTokenStatus = 0;

//       if (cvFile) {
//         const formData = new FormData();
//         formData.append("cv", cvFile);

//         // Upload the CV file and get the URL
//         const uploadResponse = await axios.post("/api/upload-cv", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         cvUrl = uploadResponse.data.fileUrl;
//         CVFreeJobTokenStatus = 1;
//       }

//       const fullData = {
//         ...formData,
//         cvUrl,
//         CVFreeJobTokenStatus,
//       };

//       const response = await axios.post("/api/Uregister", formData);
//       setInviteType("success");
//       setMessage("User registered successfully");
//       setInviteVisible(true);
//       setTimeout(() => {
//         router.push({
//           pathname: "/user/confirm",
//           query: { email: formData.email },
//         });
//         setInviteVisible(false);
//       }, 2000);
//     } catch (error) {
//       setInviteType("error");
//       setMessage(error.response?.data?.message || "Registration failed.");
//       setInviteVisible(true);
//       setLoading(false);
//     } finally {
//     }
//   };

//   const PasswordInputRightIcon = () => (
//     <div onClick={toggleShowPassword} style={{ cursor: "pointer" }}>
//       {showPassword ? <IoEyeOff size="1.5em" /> : <IoEye size="1.5em" />}
//     </div>
//   );

//   return (
//     <>
//       <section style={{ display: "flex", fontFamily: "Kanit, sans-serif" }}>
//         <div style={{ height: "100vh", width: "70%" }}>
//           <img
//             src="/assets/register_bg.jpg"
//             style={{ height: "100%", width: "100%" }}
//           />
//         </div>
//         <div
//           style={{
//             width: "30%",
//             display: "flex",
//             flexDirection: "column",
//             padding: "50px",
//           }}
//         >
//           <a href="/" style={{ textDecoration: "none", display: "inline" }}>
//             <img
//               src="/images/logo.png"
//               style={{ width: "40px", height: "50px", marginBottom: "30px" }}
//             />
//           </a>
//           <p
//             style={{
//               fontSize: "30px",
//               opacity: "67%",
//             }}
//           >
//             Create an account
//           </p>
//           <Grid>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="First name"
//                 value={formData.FirstName}
//                 onChange={handleChange}
//                 name="FirstName"
//                 placeholder="John"
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Last name"
//                 value={formData.LastName}
//                 onChange={handleChange}
//                 name="LastName"
//                 placeholder="Harry"
//               />
//             </Grid.Col>
//             <Grid.Col span={12}>
//               <TextInput
//                 label="Email address"
//                 value={formData.LastName}
//                 onChange={handleChange}
//                 name="email"
//                 placeholder="example@email.com"
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 label="Password"
//                 required
//                 rightSection={PasswordInputRightIcon()}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 name="confirmPassword"
//                 type={showPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 label="Confirm Password"
//                 required
//                 rightSection={PasswordInputRightIcon()}
//               />
//             </Grid.Col>
//             <Grid.Col span={12}>
//               <FileInput
//                 rightSection={icon}
//                 label="Upload CV (PDF only)"
//                 placeholder="Insert file"
//               />
//             </Grid.Col>
//             <Grid.Col span={12}>
//               <Select
//                 label="Select your university"
//                 placeholder="Select your university"
//                 name="universityName"
//                 value={formData.universityName}
//                 onChange={(value) =>
//                   setFormData({ ...formData, universityName: value })
//                 }
//                 data={universities.map((university) => ({
//                   value: university.university_name,
//                   label: university.university_name,
//                 }))}
//                 required
//                 style={{
//                   marginBottom: 40,
//                 }}
//               />
//             </Grid.Col>
//           </Grid>
//         </div>
//       </section>
//     </>
//   );
// };

// export default URegister;

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

      const response = await axios.post("/api/Uregister", fullData);
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
    <div className="flex min-h-screen flex-1">
      {loading ? ( // Conditional rendering based on loading state
        <BeatLoader color="#333" /> // Show loader when loading
      ) : (
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        style={{ fontFamily: "Kanit, sans-serif" }}>
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <a href="/">
                <img
                  className="h-14 w-auto"
                  src="/images/logo.png"
                  alt="Beingu"
                />
              </a>
              <h2
                className="my-8 text-3xl font-medium tracking-normal text-left"
                style={{ color: "#000000AB" }}
              >
                Create your account
              </h2>
            </div>

            <div className="flex space-x-4 mb-4">
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="FirstName"
                  name="FirstName"
                  type="text"
                  required
                  value={formData.FirstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="LastName"
                  name="LastName"
                  type="text"
                  required
                  value={formData.LastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mb-7">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mb-7">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                  >
                    {/* Assuming PasswordInputRightIcon is a function that returns an SVG or icon component */}
                    {PasswordInputRightIcon()}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                  >
                    {PasswordInputRightIcon()}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="cvFile"
                className="block text-sm font-medium text-gray-700"
              >
                Upload CV (PDF only)
              </label>
              <input
                id="cvFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mb-7 mt-4">
              <label
                htmlFor="universityName"
                className="block text-sm font-medium text-gray-700"
              >
                Select your university
              </label>
              <select
                id="universityName"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            </div>

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

            <div className="mt-4 items-center justify-center text-center">
              Already have an account?{" "}
              <a
                href="/user/login"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/RegisterPicture.webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default URegister;
