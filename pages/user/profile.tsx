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
  Tabs,
  Button,
  LoadingOverlay,
  Group,
  Modal,
  Notification,
} from "@mantine/core";

import axios from "axios";
import { useRouter } from "next/router";
import { FaBoxOpen, FaSearch, FaBell } from "react-icons/fa";
import { ethers } from "ethers";
import JobToken from "../contracts/JobToken.json";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [search, setSearch] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/sample-profile.jpg"); // Initial value
  const [universityName, setUniversityName] = useState("");
  const [jobTokenBalance, setJobTokenBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [lastFetched, setLastFetched] = useState(Date.now());

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    setWalletAddress(localStorage.getItem("walletAddress"));
    setFirstName(localStorage.getItem("FirstName"));
    setLastName(localStorage.getItem("LastName"));

    if (!isAuthenticated) {
      router.prefetch("/user/login");
      router.push("/user/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    fetchNFTs();
  }, [walletAddress]);

  function handleNotificationClick(notification) {
    console.log("Notification clicked", notification);
    // Set the notification details to be displayed in the modal
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedNotification(null);
  };

  function handleNotificationAction(notification) {
    console.log("Notification action clicked", notification);
    // Implement your notification action handling logic here
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/notifications/${walletAddress}`
      );
      console.log(response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
      setLastFetched(Date.now());
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [walletAddress]);

  const fetchUniversityInfo = async () => {
    try {
      const response = await axios.get(
        `/api/university-info?walletAddress=${walletAddress}`
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
          `/api/avatar-url?walletAddress=${walletAddress}`
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
      router.push("/user/login");
    }
  };

  function formatDate(dateString) {
    if (!dateString) {
      return "Unknown Date";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString(undefined, options);
  }

  useEffect(() => {
    const fetchJobTokenBalance = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
        );
        const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";
        const contract = new ethers.Contract(
          contractAddress,
          JobToken.abi,
          provider
        );
        const balance = await contract.balanceOf(walletAddress);
        setJobTokenBalance(parseFloat(ethers.utils.formatUnits(balance, 18)));
      } catch (error) {
        console.error("Error fetching JobToken balance:", error);
      }
    };

    fetchJobTokenBalance();
  }, [walletAddress]);

  const fetchNotificationById = async (notificationId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/notifications/id/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notification by ID", error);
    }
  };

  const handleAccept = async (notificationId) => {
    setIsDetailsModalOpen(false);

    setLoading(true);

    try {
      // Fetch the full notification details
      const notification = await fetchNotificationById(notificationId);
      if (!notification) {
        console.error("Notification not found");
        return;
      }

      const recipientWalletAddress = notification.senderWalletAddress;
      const senderWalletAddress = notification.recipientWalletAddress;
      const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      console.log(notificationId);

      console.log(recipientWalletAddress);
      console.log(senderWalletAddress);
      console.log(privateKey);
      // Connect to Polygon network
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );
      const signer = new ethers.Wallet(privateKey).connect(provider);
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        signer
      );

      // Get gas price
      const gasPrice = await provider.getGasPrice();
      console.log(gasPrice);
      // Execute transaction
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        ethers.utils.parseEther("1"),
        { gasPrice }
      );
      await tx.wait();

      // Update notification status on the backend
      await axios
        .post(`http://localhost:4000/notifications/${notificationId}/accept`)
        .then((response) => {
          console.log(
            "Notification Accepted and Job Token Transferred successfully",
            response
          );
        });

      // Refetch notifications to update the UI
      fetchNotifications();
    } catch (error) {
      console.error(
        "Error accepting notification and transferring Job Token",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (notificationId) => {
    setIsDetailsModalOpen(false);

    try {
      axios
        .post(`http://localhost:4000/notifications/${notificationId}/decline`)
        .then((response) => {
          console.log("Notification declined successfully", response);
        });
      fetchNotifications();
    } catch (error) {
      console.error("Error declining notification", error);
    }
  };

  // If not authenticated, render nothing or a loading spinner
  // const isAuthenticated = localStorage.getItem("token");
  // if (!isAuthenticated) return <div></div>;

  return (
    <div className="bg-gray-900 min-h-screen">
      <Container
        size="lg"
        className="p-10 bg-gray-100 shadow-lg rounded-lg min-h-screen relative"
      >
        {loading && (
          <LoadingOverlay
            visible={loading}
            overlayColor="white"
            overlayOpacity={0.5}
            loaderProps={{ size: "lg", color: "blue" }}
            className="fixed inset-0 z-50 flex justify-center items-center" // fixed and inset-0 make it full screen, z-50 ensures it's on top
          >
            <Text size="lg" align="center" className="text-lg">
              Accepting offer, please wait...
            </Text>
          </LoadingOverlay>
        )}

        <Modal
          opened={isDetailsModalOpen}
          onClose={handleCloseModal}
          title="Job Offer Details"
          className="bg-white rounded-lg shadow-xl"
        >
          {selectedNotification && (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={`http://localhost:4000${selectedNotification.companyProfilePicture}`}
                  alt="Company Profile Picture"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <div>
                  <Text
                    size="sm"
                    className="text-lg font-semibold text-gray-800"
                  >
                    {selectedNotification.position}
                  </Text>
                  <Text size="sm" className="text-md text-gray-500">
                    {selectedNotification.companyName}
                  </Text>
                </div>
              </div>
              <div className="mb-4">
                <Text size="sm" className="text-sm text-gray-600">
                  Description:{" "}
                  {selectedNotification.job_description ||
                    "No description provided."}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Text size="sm" className="text-sm text-gray-600">
                  Monthly Salary: RM{selectedNotification.salary}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Type: {selectedNotification.job_type}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Company Email: {selectedNotification.companyEmail}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Company Phone: {selectedNotification.companyPhone}
                </Text>
                <Text size="sm" className="text-sm text-gray-600 col-span-2">
                  Company Address: {selectedNotification.companyAddress}
                </Text>
              </div>
              <Text size="sm" className="text-sm text-gray-400 mb-4">
                Created At: {formatDate(selectedNotification.createdAt)}
              </Text>

              <div className="flex justify-end space-x-2">
                <Button
                  className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleAccept(selectedNotification.id)}
                >
                  Accept
                </Button>
                <Button
                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleDecline(selectedNotification.id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center">
              {/* Avatar & User Info */}
              <Avatar
                src={avatarUrl}
                size="xl"
                className="mr-4 lg:mr-6 cursor-pointer"
                onClick={() => router.push("/AvatarPage")}
              />
              <div className="space-y-1">
                <Text size="2xl" weight={700} className="text-gray-800">
                  {FirstName && LastName ? `${FirstName} ${LastName}` : "User"}
                </Text>
                <Text size="md" weight={500} className="text-gray-600">
                  University: {universityName}
                </Text>
                <Text size="md" weight={500} className="text-gray-600">
                  Job Token Balance: {jobTokenBalance}
                </Text>
              </div>
            </div>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Input
                placeholder="Search NFTs..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="pl-10 pr-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150 ease-in-out"
                style={{ backgroundColor: "#F7F9FC" }}
              />
              <FaSearch
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile" color="blue">
              NFT
            </Tabs.Tab>
            <Tabs.Tab value="notifications" color="blue">
              Offers
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="xs">
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
                        nft.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) &&
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
          </Tabs.Panel>
          <Tabs.Panel value="notifications" pt="xs">
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications
                  .filter((notification) => notification.status === "pending")
                  .map((notification, index) => (
                    <Notification
                      key={index}
                      title={notification.title || "Offer"}
                      color="blue"
                      icon={<FaBell />}
                      className="hover:bg-blue-50 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-center p-4 bg-white rounded-md shadow">
                        <div className="flex-grow">
                          <p className="text-gray-800">
                            {notification.message ||
                              "You have a new notification!"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2">
                          <Button
                            size="xs"
                            color="green"
                            className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 rounded-lg shadow px-3 py-1.5 transition ease-in-out duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(notification.id);
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            className="text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 rounded-lg shadow px-3 py-1.5 transition ease-in-out duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecline(notification.id);
                            }}
                          >
                            Decline
                          </Button>
                          <Button
                            size="xs"
                            color="blue"
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded-lg shadow px-3 py-1.5 transition ease-in-out duration-150"
                            onClick={(e) => {
                              handleNotificationAction(notification);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Notification>
                  ))
              ) : (
                <Text align="center" size="md" color="gray">
                  You have no pending notifications.
                </Text>
              )}
            </div>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};

export default Profile;
