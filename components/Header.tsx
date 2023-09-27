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
import { FaUserPlus } from "react-icons/fa";
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
  const { classes, cx } = useStyles();
  const router = useRouter(); // Get the router instance from Next.js

  const SignUpButton = () => (
    <Button
      leftIcon={<FaUserPlus size="1.5em" color="#FFF" />}
      onClick={() => toggleModal("SignUp")}
      className={cx(classes.link, classes.signUpButton)}
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

  return (
    <Header height={HEADER_HEIGHT} mb={0} className={classes.root}>
      <Container className={classes.header}>
        <Logo />

        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <Group spacing={3} className="items-center">
          <Link
            href="#"
            className={cx(classes.link)}
            onClick={(event) => {
              event.preventDefault();
              toggleModal("SignIn");
            }}
          >
            Sign in
          </Link>
          <SignUpButton />
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
