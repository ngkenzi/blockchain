import { useToggle, upperFirst } from "@mantine/hooks";
import axios from "axios";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/router";

export function AuthenticationForm(props: PaperProps) {
  const router = useRouter();
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null); // Reset error before trying to login

    try {
      const response = await axios.post("/api/loginAdmin", {
        email: form.values.email,
        password: form.values.password,
      });

      // Check if a token exists in the response (or whatever condition you want for successful login)
      if (response.data.token) {
        // Navigate to the admin panel upon successful login
        localStorage.setItem("isAuthenticatedAdmin", response.data.token);
        router.push("/mspA");
      } else {
        setError("Failed to login");
      }
    } catch (err) {
      // Handle the error based on the response from the backend
      setError(err.response?.data || "An error occurred while logging in");
    }
  };

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
      {...props}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {" "}
      <Text size="lg" weight={500}>
        Welcome to MSP Certs
      </Text>
      <Group grow mb="md" mt="md"></Group>
      {/* <Divider label="Or continue with email" labelPosition="center" my="lg" /> */}
      <form onSubmit={form.onSubmit(handleLogin)} style={{ width: "100%" }}>
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@msp.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}

          {error && <Text color="red">{error}</Text>}
        </Stack>
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {/* {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"} */}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
