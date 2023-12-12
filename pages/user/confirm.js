import { useState } from "react";
import axios from "axios";
import { Container, TextInput, Paper, Button, Text } from "@mantine/core";
import { useRouter } from 'next/router';

const Confirm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: router.query.email || "",
        code: "",
    });


    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const confirmEmail = async () => {
        try {
            const response = await axios.post("/api/Uconfirm", formData);
            if (response.status === 200) {
                setMessage("Email confirmed successfully.");

                // Redirect to login page after a slight delay
                setTimeout(() => {
                    router.push("/user/login");
                }, 1500);
            } else {
                // Handle other successful responses if any
                setMessage(response.data.message || "Confirmation successful");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Confirmation failed.";
            if (error.response?.status === 400 && error.response?.data?.code === "INVALID_CODE") {
                setMessage("Invalid confirmation code.");
            } else {
                setMessage(errorMessage);
            }
        }
    };

    return (
        <div className="bg-gray-300 h-screen">
            <Container className="w-full sm:w-2/4 md:w-2/4 lg:w-1/3 xl:w-1/3 2xl:w-1/3 p-8 rounded-lg bg-gray-300">
                <div className="shadow-lg">
                    <Paper
                        padding="xl"
                        style={{
                            margin: "8rem 0",
                            padding: "1rem",
                            borderRadius: "12px",
                            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)"
                        }}
                    >
                        <Text
                            align="center"
                            size="xl"
                            style={{ marginBottom: "1.5rem", fontWeight: 600 }}
                        >
                            Email Confirmation
                        </Text>
                        <TextInput
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            inputStyle={{ backgroundColor: "#E5E7EB" }}
                            style={{ marginBottom: 30 }}
                            label="Email"
                            required
                        />
                        <TextInput
                            placeholder="Confirmation Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            style={{ marginBottom: 40 }}
                            label="Confirmation Code"
                            required
                        />
                        <Button onClick={confirmEmail} fullWidth style={{ marginBottom: "1rem" }}>
                            Confirm
                        </Button>
                        <Text align="center" size="sm" style={{ marginTop: "1rem", color: "red" }}>
                            {message}
                        </Text>
                    </Paper>
                </div>
            </Container>
        </div>
    );
};

export default Confirm;
