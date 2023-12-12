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
import { FaBoxOpen, FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import { ethers } from "ethers";
import JobToken from "../contracts/JobToken.json";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [search, setSearch] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/sample-profile.jpg"); // Initial value
  const [universityName, setUniversityName] = useState("");
  const [jobTokenBalance, setJobTokenBalance] = useState(0);
  const [invites, setInvites] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [lastFetched, setLastFetched] = useState(Date.now());

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);

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

  function handleInviteClick(invite) {
    console.log("invite clicked", invite);
    // Set the invite details to be displayed in the modal
    setSelectedInvite(invite);
    setIsDetailsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInvite(null);
  };

  function handleInviteAction(invite) {
    console.log("invite action clicked", invite);
    // Implement your invite action handling logic here
  }

  const fetchInvites = async () => {
    try {
      const response = await axios.get("/api/getInvites", {
        params: { recipientWalletAddress: walletAddress },
      });

      setInvites(response.data);
    } catch (error) {
      console.error("Error fetching invites", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchInvites();
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

        console.log(response.data);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pageData = response.data.items.map((nft) => {
          // Check if meta data exists
          if (nft.meta) {
            return {
              name: nft.meta.name,
              description: nft.meta.description,
              image_url:
                nft.meta.content && nft.meta.content.length > 0
                  ? nft.meta.content[0].url
                  : "",
              contract: nft.contract.split(":")[1],
              tokenId: nft.tokenId,
              blockchain: nft.blockchain,
            };
          } else {
            // Return a default or partial object if meta data does not exist
            return {
              name: "NFT Name Not Available",
              description: "No description available",
              image_url: "",
              contract: nft.contract.split(":")[1],
              tokenId: nft.tokenId,
              blockchain: nft.blockchain,
            };
          }
        });

        nftData = [
          ...nftData,
          ...pageData.filter((nft) => nft.name !== "NFT Name Not Available"),
        ];

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
          setAvatarUrl("https://i.imgur.com/mCHMpLT.png");
        }
      } catch (error) {
        console.error("Error fetching avatar URL", error);
        setAvatarUrl("https://i.imgur.com/mCHMpLT.png");
      }
    };

    if (walletAddress) {
      fetchAvatarUrl();
    }
  }, [walletAddress]);

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

  const fetchInviteById = async (inviteId) => {
    try {
      const response = await axios.get("/api/getInviteById", {
        params: { inviteId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching invite by ID", error);
    }
  };

  const handleAccept = async (inviteId) => {
    setIsDetailsModalOpen(false);

    setLoading(true);

    try {
      // Fetch the full invite details
      const invite = await fetchInviteById(inviteId);
      if (!invite) {
        console.error("invite not found");
        return;
      }

      const recipientWalletAddress = invite.senderWalletAddress;
      const senderWalletAddress = invite.recipientWalletAddress;
      const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

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
      // Execute transaction
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        ethers.utils.parseEther("1"),
        { gasPrice }
      );
      await tx.wait();

      // Update invite status on the backend
      await axios.post("/api/acceptInvite", null, {
        params: { inviteId },
      });

      // Refetch invites to update the UI
      fetchInvites();
    } catch (error) {
      console.error("Error accepting invite and transferring Job Token", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (inviteId) => {
    setIsDetailsModalOpen(false);

    try {
      await axios.post("/api/declineInvite", null, {
        params: { inviteId },
      });
      fetchInvites();
    } catch (error) {
      console.error("Error declining invite", error);
    }
  };

  const handleLogoutConfirmation = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.push("/user/login");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Container
        size="lg"
        className="p-4 md:p-10 bg-gray-100 shadow-lg rounded-lg min-h-screen relative"
      >
        {/* Logout Icon */}
        <div className="absolute top-4 right-4">
          <FaSignOutAlt
            className="text-gray-500 cursor-pointer hover:text-red-500"
            size={24}
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div>

        {/* Logout Confirmation Modal */}
        <Modal
          opened={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Logout Confirmation"
        >
          <Text size="sm">Are you sure you want to logout?</Text>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleLogoutConfirmation}>
              Logout
            </Button>
          </div>
        </Modal>

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
          {selectedInvite && (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={`http://13.250.122.124${selectedInvite.companyProfilePicture}`}
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
                    {selectedInvite.position}
                  </Text>
                  <Text size="sm" className="text-md text-gray-500">
                    {selectedInvite.companyName}
                  </Text>
                </div>
              </div>
              <div className="mb-4">
                <Text size="sm" className="text-sm text-gray-600">
                  Description:{" "}
                  {selectedInvite.job_description || "No description provided."}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Text size="sm" className="text-sm text-gray-600">
                  Monthly Salary: RM{selectedInvite.salary}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Type: {selectedInvite.job_type}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Company Email: {selectedInvite.companyEmail}
                </Text>
                <Text size="sm" className="text-sm text-gray-600">
                  Company Phone: {selectedInvite.companyPhone}
                </Text>
                <Text size="sm" className="text-sm text-gray-600 col-span-2">
                  Company Address: {selectedInvite.companyAddress}
                </Text>
              </div>
              <Text size="sm" className="text-sm text-gray-400 mb-4">
                Created At: {formatDate(selectedInvite.createdAt)}
              </Text>

              <div className="flex justify-end space-x-2">
                <Button
                  className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleAccept(selectedInvite.id)}
                >
                  Accept
                </Button>
                <Button
                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleDecline(selectedInvite.id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar
              src={avatarUrl}
              size="xl"
              className="cursor-pointer"
              onClick={() => router.push("/user/AvatarPage")}
            />
            <div>
              <Text size="lg" weight={700}>
                {FirstName && LastName ? `${FirstName} ${LastName}` : "User"}
              </Text>
              <Text size="sm">
                {universityName
                  ? `University: ${universityName}`
                  : "University not set"}
              </Text>
              <Text size="sm">Job Token Balance: {jobTokenBalance}</Text>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Input
            placeholder="Search NFTs..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="pl-10 pr-4 rounded-lg"
          />
          <FaSearch
            className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
            size={18}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile" color="blue">
              NFT
            </Tabs.Tab>
            <Tabs.Tab value="invites" color="blue">
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
                        (nft.description?.toLowerCase().includes("course") ||
                          nft.description?.toLowerCase().includes("tier"))
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
                    (nft.description?.toLowerCase().includes("course") ||
                      nft.description?.toLowerCase().includes("tier"))
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
          <Tabs.Panel value="invites" pt="xs">
            <div className="space-y-4">
              {invites.length > 0 ? (
                invites
                  .filter((invite) => invite.status === "pending")
                  .map((invite, index) => (
                    <Notification
                      key={index}
                      title={invite.title || "Offer"}
                      color="blue"
                      icon={<FaBell />}
                      className="hover:bg-blue-50 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                      onClick={() => handleInviteClick(invite)}
                    >
                      <div className="flex justify-between items-center p-4 bg-white rounded-md shadow">
                        <div className="flex-grow">
                          <p className="text-gray-800">
                            {invite.message || "You have a new invite!"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(invite.createdAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2">
                          <Button
                            size="xs"
                            color="green"
                            className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 rounded-lg shadow px-3 py-1.5 transition ease-in-out duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(invite.id);
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
                              handleDecline(invite.id);
                            }}
                          >
                            Decline
                          </Button>
                          <Button
                            size="xs"
                            color="blue"
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded-lg shadow px-3 py-1.5 transition ease-in-out duration-150"
                            onClick={(e) => {
                              handleInviteAction(invite);
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
                  You have no pending invites.
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
