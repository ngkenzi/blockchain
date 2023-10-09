import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Col,
  Paper,
  Text,
  Image,
  Input,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { Notification } from "@mantine/core";
import { FaBoxOpen, FaSearch } from "react-icons/fa";

const User = () => {
  const [nfts, setNfts] = useState([]);
  const [search, setSearch] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/sample-profile.jpg"); // Initial value
  const [universityName, setUniversityName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    setWalletAddress(localStorage.getItem("walletAddress"));

    if (!isAuthenticated) {
      router.prefetch("/Ulogin");
      router.push("/Ulogin");
      return;
    }
  }, [router]);

  useEffect(() => {
    fetchNFTs();
  }, [walletAddress]);

  const fetchUniversityInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user-university?walletAddress=${walletAddress}`
      );
      if (response.data.universityName) {
        setUniversityName(response.data.universityName);
      }
    } catch (error) {
      console.error("Error fetching university info", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchUniversityInfo();
    }
  }, [walletAddress]);

  const fetchNFTs = async () => {
    let page = 1;
    let moreDataExists = true;
    let nftData = [];

    while (moreDataExists) {
      let url = `/api/rarible?address=${walletAddress}`;
      console.log(url);
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "d94d0879-f919-4803-b293-11ea277a2982",
          },
        });

        console.log(walletAddress);
        console.log(response.data);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pageData = response.data.items.map((nft: any) => ({
          name: nft.meta.name,
          description: nft.meta.description,
          image_url:
            nft.meta.content && nft.meta.content.length > 0
              ? nft.meta.content[0].url
              : "",
          contract: nft.contract.split(":")[1],
          tokenId: nft.tokenId,
          blockchain: nft.blockchain,
        }));

        nftData = [...nftData, ...pageData];

        moreDataExists = pageData.length === 100;
        page++;
        if (moreDataExists) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(error);
        moreDataExists = false; // Exit loop if an error occurs
      }
    }

    setLoading(false);
    setNfts(nftData);
  };

  useEffect(() => {
    // Fetch avatar URL from the backend
    const fetchAvatarUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/get-avatar-url?walletAddress=${walletAddress}`
        );
        if (response.data.avatarUrl && response.data.avatarUrl !== "") {
          setAvatarUrl(response.data.avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching avatar URL", error);
        setAvatarUrl("/sample-profile.jpg");
      }
    };

    if (walletAddress) {
      fetchAvatarUrl();
    }
  }, [walletAddress]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.push("/Ulogin");
    }
  };

  // If not authenticated, render nothing or a loading spinner
  // const isAuthenticated = localStorage.getItem("token");
  // if (!isAuthenticated) return <div></div>;

  return (
    <Container
      size="lg"
      className="p-10 bg-white shadow-lg rounded-lg min-h-screen relative"
    >
      {" "}
      {/* User Profile */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Avatar
              src={avatarUrl}
              size="xl"
              className="mr-6 cursor-pointer"
              onClick={() => router.push("/AvatarPage")}
            />
            <div>
              <Text size="xxl" weight={700}>
                User's NFTs
              </Text>
              <Text size="md" weight={500}>
                University: {universityName}
              </Text>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input
              placeholder="Search NFTs..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              className="pl-10 pr-4 rounded-full shadow-sm border-gray-300"
              style={{ backgroundColor: "#F7F9FC" }}
            />
            <FaSearch
              className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              size={18}
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {/* Display NFTs */}
      {loading ? (
        <Text align="center" size="lg">
          Loading...
        </Text>
      ) : (
        <>
          {nfts.length === 0 && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaBoxOpen size="60" color="gray" />
              <Text align="center" size="lg" style={{ color: "gray" }}>
                No NFTs found for the user
              </Text>
            </div>
          )}
          <Grid gutter="md">
            {nfts
              .filter(
                (nft) =>
                  nft.name?.toLowerCase().includes(search.toLowerCase()) &&
                  nft.description?.toLowerCase().includes("course")
              )
              .map((nft, index) => (
                <Col key={index} md={6} lg={4}>
                  <a
                    href={`https://rarible.com/token/${nft.blockchain.toLowerCase()}/${
                      nft.contract
                    }:${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-6"
                  >
                    <Paper
                      elevation={3}
                      className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <Image
                        src={nft.image_url || "/default-image-path.jpg"}
                        alt="NFT"
                        fit="cover"
                        className="rounded-t-lg"
                      />
                      <div className="p-4">
                        <Text size="xl" weight={700} className="mb-2">
                          {nft.name}
                        </Text>
                        <Text size="sm" color="gray">
                          {nft.description}
                        </Text>
                      </div>
                    </Paper>
                  </a>
                </Col>
              ))}
          </Grid>
          {nfts.filter(
            (nft) =>
              nft.name?.toLowerCase().includes(search.toLowerCase()) &&
              nft.description?.toLowerCase().includes("course")
          ).length === 0 &&
            nfts.length !== 0 && (
              <Text
                align="center"
                size="lg"
                style={{ color: "red", marginTop: "20px" }}
              >
                No NFTs match the search criteria.
              </Text>
            )}
        </>
      )}
    </Container>
  );
};

export default User;
