// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";
// import { TextInput, Button } from "@mantine/core";
// import Link from "next/link";

// const login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const [focused, setFocused] = useState(false);
//   const [value, setValue] = useState("");
//   const floating = value.trim().length !== 0 || focused || undefined;

//   const handleChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const loginUser = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axios.post("/api/Ulogin", formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.data && response.data.token) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("walletAddress", response.data.walletAddress);
//         localStorage.setItem("FirstName", response.data.FirstName);
//         localStorage.setItem("LastName", response.data.LastName);

//         setMessage("Logged in successfully.");
//         router.push("/user/profile");
//       } else {
//         setMessage("Login failed.");
//       }
//     } catch (error) {
//       setMessage(error.response ? error.response.data : "Login failed.");
//       setIsLoading(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <section style={{ display: "flex", fontFamily: "Kanit, sans-serif" }}>
//         <div style={{ height: "100vh", width: "70%" }}>
//           <img
//             src="/assets/login_bg.png"
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
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "30px" }}
//           >
//             <p
//               style={{
//                 fontSize: "30px",
//                 opacity: "67%",
//               }}
//             >
//               Login to your account
//             </p>
//             <TextInput
//               label="Email"
//               value={formData.email}
//               onChange={handleChange}
//               name="email"
//             />
//             <TextInput
//               label="Password"
//               value={formData.password}
//               onChange={handleChange}
//               name="password"
//               type="password"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               disabled={isLoading}
//               variant="filled"
//               style={{ backgroundColor: "#0079E9", width: "100%" }}
//               size="md"
//             >
//               {isLoading ? "Logging in..." : "Login"}
//             </Button>
//           </div>
//           <p
//             style={{ fontSize: "12px", textAlign: "right", marginTop: "15px" }}
//           >
//             Don't have an account?{" "}
//             <Link
//               href="/user/register"
//               style={{
//                 color: "#0079E9",
//                 textDecoration: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </section>
//     </>
//   );
// };

// export default login;

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

        setMessage("Logged in successfully.");
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
    <div className="bg-gray-300 min-h-screen flex items-center justify-center">
      {isLoading ? (
        <BeatLoader color="#333" />
      ) : (
        <Container className="w-full sm:w-2/4 md:w-2/4 lg:w-1/3 xl:w-1/3 2xl:w-1/3 p-8 rounded-lg">
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

export default login;
