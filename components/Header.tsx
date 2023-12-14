import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  FaUserPlus,
  FaHome,
  FaUserGraduate,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Button } from "@mantine/core";

import Link from "next/link";
import Logo from "./logo";

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 2, // Increase the z-index value
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 3, // Increase the z-index value
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  signUpButton: {
    backgroundColor: theme.colors.blue[6], // Adjust color as needed
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.colors.blue[7],
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string; isExternal?: boolean }[];
  toggleModal: (action: "SignIn" | "SignUp") => void;
}

export function HeaderResponsive({
  links,
  toggleModal,
}: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { classes, cx } = useStyles();
  const router = useRouter(); // Get the router instance from Next.js

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  const mobileMenuItems = [
    {
      label: "Home",
      icon: <FaHome size="1.5em" />,
      action: () => router.push("/"),
    },
    {
      label: "Students",
      icon: <FaUserGraduate size="1.5em" />,
      action: () => router.push("/students"),
    },
    ...(!isAuthenticated
      ? [
          {
            label: "Sign in",
            icon: <FaUserPlus size="1.5em" />,
            action: () => router.push("/user/login"),
          },
          {
            label: "Register",
            icon: <FaUserPlus size="1.5em" />,
            action: () => router.push("/user/register"),
          },
        ]
      : [
          {
            label: "My Account",
            icon: <FaUser size="1.5em" />, // Use appropriate icon
            action: () => router.push("/user/profile"),
          },
          {
            label: "Logout",
            icon: <FaSignOutAlt size="1.5em" />, // Use appropriate icon
            action: handleLogout,
          },
        ]),
  ];

  const mobileMenu = mobileMenuItems.map((item, index) => (
    <a
      key={index}
      href="#"
      className="flex items-center py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
      onClick={(event) => {
        event.preventDefault();
        item.action();
        close();
      }}
    >
      {item.icon}
      <span className="ml-2">{item.label}</span>
    </a>
  ));

  const SignUpButton = () => (
    <Button
      leftIcon={<FaUserPlus size="1.5em" color="#FFF" />}
      onClick={() => router.push("/user/register")}
      className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded"
    >
      Register
    </Button>
  );

  useEffect(() => {
    setActive(router.pathname);
  }, [router.pathname]);

  const items = links.map((link) => {
    if (link.isExternal) {
      return (
        <a
          key={link.label}
          href={link.link}
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Recommended for security reasons
          className={cx(classes.link, {
            [classes.linkActive]: active === link.link,
          })}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.label}
        href={link.link}
        className={cx(classes.link, {
          [classes.linkActive]: active === link.link,
        })}
        onClick={(event) => {
          event.preventDefault();
          setActive(link.link);
          close();
          router.push(link.link);
        }}
      >
        {link.label}
      </Link>
    );
  });

  // Desktop Menu - Sign In and Register or My Account and Logout
  const desktopMenu = isAuthenticated ? (
    <Group spacing={3} className="items-center hidden md:flex">
      <Link href="/user/profile" passHref>
        <Button
          component="a"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          My Account
        </Button>
      </Link>
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Log out
      </Button>
    </Group>
  ) : (
    <Group spacing={3} className="items-center hidden md:flex">
      <Button
        onClick={(event) => {
          event.preventDefault();
          router.push("/user/login");
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Sign in
      </Button>
      <SignUpButton />
    </Group>
  );

  return (
    <Header height={HEADER_HEIGHT} mb={0} className={classes.root}>
      <Container className={classes.header}>
        <Logo />

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Group spacing={5} className={`${classes.links} hidden md:flex`}>
          {items}
        </Group>

        {desktopMenu}

        {/* "Sign In" and "Register" buttons for larger screens */}
        {/* <Group spacing={3} className="items-center hidden md:flex">
          <Link
            href="#"
            onClick={(event) => {
              event.preventDefault();
              toggleModal("SignIn");
            }}
          >
            Sign in
          </Link>
          <SignUpButton />
        </Group> */}

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {mobileMenu}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
