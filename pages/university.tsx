import Head from "next/head";
import Login from "./university/login";

const University: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Uni Dashboard</title>
        <meta
          name="description"
          content="Welcome to the University Dashboard"
        />
      </Head>
      <Login />
    </div>
  );
};

export default University;
