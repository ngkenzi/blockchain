import Head from "next/head";
import NFTViewer from "./NFTViewer";

const MSP: React.FC = () => {
  return (
    <div>
      <Head>
        <title>MSP Dashboard</title>
        <meta name="description" content="Welcome to the MSP Dashboard" />
      </Head>

      <NFTViewer />
    </div>
  );
};

export default MSP;
