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
  Textarea,
} from "@mantine/core";

import axios from "axios";
import { useRouter } from "next/router";
import {
  FaBoxOpen,
  FaSearch,
  FaBell,
  FaHome,
  FaSignOutAlt,
  FaClipboardList,
  FaTimes,
  FaCheckCircle,
  FaHourglassStart,
  FaSpinner,
  FaEdit,
  FaCoins,
  FaLayerGroup,
} from "react-icons/fa"; // Icons from react-icons
import Minter from "./Minter";

import { ethers } from "ethers";
import JobToken from "../contracts/JobToken.json";
import SelfAssessmentCTA from "../../components/SelfAssessmentCTA";
import { BeatLoader, ClipLoader } from "react-spinners";
import { FaCopy, FaCheck } from "react-icons/fa";

import EmploymentBadge from "./EmploymentBadge";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [search, setSearch] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [CVFreeJobTokenStatus, setCVFreeJobTokenStatus] = useState(0);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [claimableTokens, setClaimableTokens] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [tokensClaimed, setTokensClaimed] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("/sample-profile.jpg"); // Initial value
  const [universityName, setUniversityName] = useState("");
  const [jobTokenBalance, setJobTokenBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);

  const [invites, setInvites] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [lastFetched, setLastFetched] = useState(Date.now());

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] =
    useState(false);
  const [triggerMinting, setTriggerMinting] = useState(false);

  const [meetings, setMeetings] = useState([]);
  //issuing employment badge
  const [generatedImageData, setGeneratedImageData] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);

  const router = useRouter();
  const [step, setStep] = useState(1);
  const uniAddress = "0xbaeb7bcfa679bf0132df2a1b8d273f327cfb0542";

  const [isCvUploadModalOpen, setIsCvUploadModalOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  const [transactionHistory, setTransactionHistory] = useState([]);

  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get("/api/assessments");

        if (response.data.success) {
          console.log(response.data.assessments);
          setAssessments(response.data.assessments);
        } else {
          console.error(response.data.message);
          setAssessments([]);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoadingAssessments(false);
      }
    };

    fetchAssessments();
  }, []);

  const navigateToAssessment = () => {
    router.push("/assessment");
  };

  const handleImageGenerate = (imgData) => {
    setGeneratedImageData(imgData);
    setStep(2);
  };

  const onMintingComplete = () => {
    setTriggerMinting(false);
    setIsMinting(false); // Reset minting status
    setTimeout(() => {
      setIsConfirmAcceptModalOpen(false);
    }, 3000);
  };

  const onMintingStart = () => {
    setIsMinting(true);
  };

  function StepIndicator({ currentStep }) {
    const steps = [
      {
        number: 1,
      },
      { number: 2 },
    ];

    return <div></div>;
  }

  const navigateHome = () => {
    router.push("/");
  };

  useEffect(() => {
    setFullName(`${FirstName} ${LastName}`);
  }, [FirstName, LastName]);

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

  // Function to fetch meetings for the user
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/getMeetingsByUserId", {
        params: { studentId: studentId },
      });

      setMeetings(response.data.meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  // useEffect to fetch meetings when the studentId changes
  useEffect(() => {
    if (studentId) {
      fetchMeetings();
    }
  }, [studentId]);

  function handleInviteClick(invite) {
    // Set the invite details to be displayed in the modal
    setSelectedInvite(invite);
    setIsDetailsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInvite(null);
  };

  function handleInviteAction(invite) {
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
      fetchStudentInfo();
      fetchMeetings();
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

  const fetchStudentInfo = async () => {
    if (walletAddress) {
      try {
        const response = await axios.get(
          `/api/getStudentInfoByWalletAddress?walletAddress=${walletAddress}`
        );
        const studentData = response.data;
        setStudentId(studentData.id);
        setCvUrl(studentData.cvUrl);
        setCVFreeJobTokenStatus(studentData.CVFreeJobTokenStatus);
        setInvitationCode(studentData.invitation_code);
        setClaimableTokens(studentData.claimable_tokens);
        console.log(cvUrl);
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    }
  };

  // useEffect(() => {
  //   fetchStudentInfo();
  // }, [walletAddress]);

  const checkSubmission = async () => {
    const userWAddress = localStorage.getItem("walletAddress");
    try {
      const response = await axios.get(
        `/api/checkSubmissionStatus?walletAddress=${userWAddress}`
      );

      if (response.data.exists) {
        setHasSubmitted(true);
        setTokensClaimed(response.data.tokensClaimed);
      } else {
        setHasSubmitted(false);
        setTokensClaimed(false);
      }
      setIsSubmissionStatusLoaded(true);
    } catch (error) {
      console.error("Error checking submission status:", error);
      setIsSubmissionStatusLoaded(true);
    }
  };

  // Define fetchJobTokenBalance outside of useEffect
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

  const fetchMaticBalance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );

      // Fetch the balance of the walletAddress
      const balance = await provider.getBalance(walletAddress);

      // Convert the balance from Wei to Ether (or Matic, in the case of Polygon)
      const formattedBalance = ethers.utils.formatEther(balance);

      // Update your state or UI with the Matic balance
      setMaticBalance(parseFloat(formattedBalance));
    } catch (error) {
      console.error("Error fetching Matic balance:", error);
    }
  };

  // Function to handle the claim token action
  const handleClaimTokens = async () => {
    setLoadingClaim(true);

    // Sender's wallet address (fixed)
    const senderWalletAddress = "0x01Ff83b084498CfDa27497F14D5c2AdbB5a7f73D";

    // Recipient's wallet address (user's address)
    const recipientWalletAddress = walletAddress;

    // Contract address for the Job Token
    const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";

    // Sender's private key (stored in environment variables)
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    try {
      // Connect to the Ethereum network (Polygon Mainnet in this case)
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );

      // Create a new instance of the wallet with the private key and connect it to the provider
      const signer = new ethers.Wallet(privateKey, provider);

      // Create a new instance of the contract
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        signer
      );

      // Get the current gas price from the network
      const currentGasPrice = await provider.getGasPrice();

      const gasPrice = currentGasPrice.mul(ethers.BigNumber.from(2)); // Increase gas price by a factor of 2

      // Execute the transaction to transfer the tokens
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        ethers.utils.parseEther("5"), // Send 5 tokens
        { gasPrice }
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Define the amount of Matic to send
      const maticAmount = ethers.utils.parseEther("2");

      // Create a transaction object for sending Matic
      const maticTransferTx = {
        to: recipientWalletAddress,
        value: maticAmount,
        gasPrice: gasPrice,
      };

      // Execute the Matic transfer
      const maticTx = await signer.sendTransaction(maticTransferTx);
      await maticTx.wait();

      // Update the database status
      await axios.post(`/api/claimTokens?walletAddress=${walletAddress}`);
      setTokensClaimed(true);
      fetchJobTokenBalance();
      fetchMaticBalance();
    } catch (error) {
      console.error("Error claiming Job Tokens:", error);
    } finally {
      setLoadingClaim(false);
    }
  };

  const handleClaimTokensCV = async () => {
    setLoadingClaim(true);

    // Sender's wallet address (fixed)
    const senderWalletAddress = "0x01Ff83b084498CfDa27497F14D5c2AdbB5a7f73D";

    // Recipient's wallet address (user's address)
    const recipientWalletAddress = walletAddress;

    // Contract address for the Job Token
    const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";

    // Sender's private key (stored in environment variables)
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    try {
      // Connect to the Ethereum network (Polygon Mainnet in this case)
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );

      // Create a new instance of the wallet with the private key and connect it to the provider
      const signer = new ethers.Wallet(privateKey, provider);

      // Create a new instance of the contract
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        signer
      );

      // Get the current gas price from the network
      const currentGasPrice = await provider.getGasPrice();

      const gasPrice = currentGasPrice.mul(ethers.BigNumber.from(2)); // Increase gas price by a factor of 2

      // Execute the transaction to transfer the tokens
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        ethers.utils.parseEther("5"), // Send 5 tokens
        { gasPrice }
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // After successfully transferring tokens, update the student's profile
      await axios.post("/api/updateStudentProfile", {
        studentId,
        cvUrl,
        CVFreeJobTokenStatus: 2,
      });

      fetchStudentInfo();
      fetchTransactionHistory();
      alert(
        "5 Job Tokens have been successfully claimed! You can check the transaction details in the History tab."
      );
    } catch (error) {
      console.error("Error claiming Job Tokens:", error);
    } finally {
      setLoadingClaim(false);
    }
  };

  useEffect(() => {
    checkSubmission();
  }, []);

  const fetchNFTs = async () => {
    let page = 1;
    let moreDataExists = true;
    let nftData = [];

    while (moreDataExists) {
      let url = `/api/rarible?address=${walletAddress}`;
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
          setAvatarUrl(response.data.avatarUrl);
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
    fetchJobTokenBalance();
    fetchMaticBalance();
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
    setSelectedInvite(inviteId);
    // Show confirmation modal
    setIsDetailsModalOpen(false);
    setIsConfirmAcceptModalOpen(true);
    const invite = await fetchInviteById(inviteId);
    if (invite) {
      setSelectedInvite(invite);

      // Format the date and set it
      setFormattedDate(formatDate(invite.createdAt));
    }
  };

  const confirmAccept = async (inviteId) => {
    //setIsDetailsModalOpen(false);
    setIsConfirmAcceptModalOpen(false);

    setLoading(true);
    setTriggerMinting(true);

    try {
      // Fetch the full invite details
      const id = inviteId.id;

      const invite = await fetchInviteById(id);
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
      const currentGasPrice = await provider.getGasPrice();

      const gasPrice = currentGasPrice.mul(ethers.BigNumber.from(3)); // Increase gas price by a factor of 2
      // Execute transaction
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        ethers.utils.parseEther("1"),
        { gasPrice }
      );
      await tx.wait();

      // Update invite status on the backend
      await axios.post(`/api/acceptInvite?inviteId=${id}`);

      fetchJobTokenBalance();

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

  const updateMeetingStatus = async (meetingId, newStatus) => {
    try {
      await axios.post(`/api/updateMeetingStatus`, {
        meetingId,
        status: newStatus,
      });
      fetchMeetings(); // Refetch meetings to update the list
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  const handleClaimRewards = async () => {
    setLoadingClaim(true);

    // Sender's wallet address (fixed)
    const senderWalletAddress = "0x01Ff83b084498CfDa27497F14D5c2AdbB5a7f73D";

    // Recipient's wallet address (user's address)
    const recipientWalletAddress = walletAddress;

    // Contract address for the Job Token
    const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";

    // Sender's private key (stored in environment variables)
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    try {
      const amountToClaim = ethers.utils.parseUnits(
        claimableTokens.toString(),
        18
      );

      // Connect to the Ethereum network (Polygon Mainnet in this case)
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );

      // Create a new instance of the wallet with the private key and connect it to the provider
      const signer = new ethers.Wallet(privateKey, provider);

      // Create a new instance of the contract
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        signer
      );

      // Get the current gas price from the network
      const currentGasPrice = await provider.getGasPrice();

      const gasPrice = currentGasPrice.mul(ethers.BigNumber.from(3)); // Increase gas price by a factor of 2

      // Execute the transaction to transfer the tokens
      const tx = await contract.transferOnBehalf(
        senderWalletAddress,
        recipientWalletAddress,
        amountToClaim,
        { gasPrice }
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Deduct claimableTokens in the database for the user
      await axios.post("/api/deductClaimableTokens", {
        walletAddress: recipientWalletAddress,
        amountToDeduct: claimableTokens,
      });

      // Fetch updated student info to reflect the change in UI
      fetchStudentInfo();
      fetchJobTokenBalance();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setLoadingClaim(false);
    }
  };

  // Function to handle accepting a meeting
  const handleAcceptMeeting = async (meetingId) => {
    await updateMeetingStatus(meetingId, "scheduled");
  };

  const handleCvUpload = async () => {
    if (cvFile) {
      const formData = new FormData();
      formData.append("cv", cvFile);

      try {
        // Upload the file first
        const uploadResponse = await axios.post("/api/upload-cv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const cvUrl = uploadResponse.data.fileUrl;

        // Update student's profile
        await axios.post("/api/updateStudentProfile", {
          studentId,
          cvUrl,
          CVFreeJobTokenStatus: 1,
        });

        fetchStudentInfo(); // Refetch user info to update state
        setIsCvUploadModalOpen(false); // Close the modal
      } catch (error) {
        console.error("Error uploading CV:", error);
      }
    }
  };

  // Function to handle cancelling a meeting
  const handleCancelMeeting = async (meetingId) => {
    await updateMeetingStatus(meetingId, "cancelled");
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.post(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL",
        {
          jsonrpc: "2.0",
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              category: ["erc20", "erc721"],
              withMetadata: false,
              excludeZeroValue: true,
              maxCount: "0x3e8",
              contractAddresses: [
                "0x44AA144A60af0C745759912eA9C58476e49d9967",
                "0x9214a1B70a0F348dB103552c83A11b02a5D9fF90",
              ],
            },
          ],
        }
      );

      if (response.data && response.data.result) {
        setTransactionHistory(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Container
        size="lg"
        className="p-4 md:p-10 bg-gray-100 shadow-lg rounded-lg min-h-screen relative"
      >
        {/* Icons */}
        <div className="flex justify-between items-center p-4">
          {/* Home Icon */}
          <FaHome
            className="text-gray-500 cursor-pointer hover:text-blue-500"
            size={24}
            onClick={navigateHome}
          />

          <div className="flex items-center">
            {/* Conditional Upload CV Button */}
            {cvUrl === "N/A" && (
              <Button
                onClick={() => setIsCvUploadModalOpen(true)}
                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload CV
              </Button>
            )}

            {/* Rewards Button */}
            <Button
              className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsRewardsModalOpen(true)} // Toggle modal visibility
            >
              Rewards
            </Button>

            {/* Logout Icon */}
            <FaSignOutAlt
              className="text-gray-500 cursor-pointer hover:text-red-500"
              size={24}
              onClick={() => setIsLogoutModalOpen(true)}
            />
          </div>
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

        {/* Rewards Modal */}
        <Modal
          opened={isRewardsModalOpen}
          onClose={() => setIsRewardsModalOpen(false)}
          title={
            <Text weight={500} size="lg" style={{ color: "#333" }}>
              Rewards
            </Text>
          }
          size="lg"
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          <div style={{ padding: "20px" }}>
            <Paper
              shadow="xs"
              radius="md"
              p="md"
              style={{ marginBottom: "30px", backgroundColor: "#FAFAFA" }}
            >
              <Text size="md" style={{ marginBottom: "10px" }}>
                Claimable Job Tokens:
              </Text>
              <Text weight={700} size="xl" style={{ color: "#4CAF50" }}>
                {claimableTokens}
              </Text>
            </Paper>

            <Paper
              shadow="xs"
              radius="md"
              p="md"
              style={{ marginBottom: "30px", backgroundColor: "#FAFAFA" }}
            >
              <Text size="md" style={{ marginBottom: "10px" }}>
                Your Invitation Code:
              </Text>
              <Text
                weight={700}
                size="xl"
                style={{
                  color: "#333",
                  background: "#EFEFEF",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {invitationCode}
              </Text>
            </Paper>

            {/* Claim Button */}
            {claimableTokens > 0 && (
              <Button
                color="blue"
                onClick={handleClaimRewards}
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  marginTop: "20px",
                  backgroundColor: "#0B5ED7",
                  color: "white",
                }}
                radius="md"
                disabled={loadingClaim}
              >
                {loadingClaim ? (
                  <span>Claiming tokens...</span>
                ) : (
                  <Group position="center">
                    <FaCoins style={{ marginRight: "10px" }} />
                    <span>Claim Tokens</span>
                  </Group>
                )}
              </Button>
            )}
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

        <Modal
          opened={isConfirmAcceptModalOpen}
          onClose={() => setIsConfirmAcceptModalOpen(false)}
          title="Accept Offer Confirmation"
        >
          <StepIndicator currentStep={step} />
          {step === 1 && (
            <div className="relative flex justify-center items-center min-h-screen">
              <BeatLoader color="#3498db" className="absolute z-10 top-1/4" />
              <EmploymentBadge
                student={fullName}
                studentId={studentId}
                date={formattedDate}
                company={selectedInvite ? selectedInvite.companyName : ""}
                onImageGenerate={handleImageGenerate}
              />
            </div>
          )}

          {step === 2 && (
            <div className="mb-3">
              <Minter
                generatedImageData={generatedImageData}
                student={fullName}
                studentId={parseInt(studentId)}
                courseName={"Yo"}
                courseDate={formattedDate}
                walletAddress={walletAddress}
                uniAddress={uniAddress}
                onMintingStart={onMintingStart}
                onMintingComplete={onMintingComplete}
                web3Modal={undefined}
                loadWeb3Modal={undefined}
                price={undefined}
                triggerMint={triggerMinting}
              />
            </div>
          )}

          <Text size="sm">
            Accepting this offer will cost you <strong>1 Job Tokens</strong>.
            Are you sure you want to proceed?
          </Text>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsConfirmAcceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="green"
              onClick={() => confirmAccept(selectedInvite)}
              disabled={jobTokenBalance < 1} // Disable if user has less than 5 tokens
            >
              Confirm
            </Button>
          </div>
        </Modal>

        <Modal
          opened={isCvUploadModalOpen}
          onClose={() => setIsCvUploadModalOpen(false)}
          title="Upload CV"
        >
          <input
            type="file"
            onChange={(e) => setCvFile(e.target.files[0])}
            accept=".pdf"
          />
          <Button
            onClick={handleCvUpload}
            disabled={!cvFile} // Button is disabled if cvFile is null
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload
          </Button>
        </Modal>

        <header className="flex flex-col md:flex-row justify-center items-center text-center mb-8">
          <div className="flex flex-col items-center space-y-4">
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
              <Text size="sm">Matic Balance: {maticBalance}</Text>

              {/* Claim Tokens Button */}
              {hasSubmitted && !tokensClaimed && (
                <Button
                  color={loadingClaim ? "gray" : "green"}
                  onClick={handleClaimTokens}
                  className={`mt-4 ${
                    loadingClaim
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-green-500 to-blue-500"
                  } text-white`}
                  disabled={loadingClaim}
                >
                  {loadingClaim ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Claim your 5 Job Tokens & 2 Matic 🎁"
                  )}
                </Button>
              )}

              {/* {cvUrl && CVFreeJobTokenStatus === 1 && (
                <Button
                  color={loadingClaim ? "gray" : "green"}
                  onClick={handleClaimTokensCV}
                  className={`mt-4 ${
                    loadingClaim ? "bg-gray-500" : "bg-green-500"
                  }`}
                  disabled={loadingClaim}
                >
                  {loadingClaim ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Claim your 5 Job Tokens 🎁"
                  )}
                </Button>
              )} */}
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
              Digital Cert
            </Tabs.Tab>
            <Tabs.Tab value="invites" color="blue">
              Offers
            </Tabs.Tab>
            <Tabs.Tab value="history" color="blue">
              History
            </Tabs.Tab>
            <Tabs.Tab value="meetings" color="blue">
              Meetings
            </Tabs.Tab>
            <Tabs.Tab value="assessments" color="blue">
              Assessments
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
                          nft.description?.toLowerCase().includes("tier") ||
                          nft.description?.toLowerCase().includes("company"))
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
                      nft.description?.toLowerCase().includes("tier") ||
                      nft.description?.toLowerCase().includes("company"))
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

          <Tabs.Panel value="history" pt="xs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Function
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Transaction Hash
                    </th>
                    <th scope="col" className="px-6 py-3">
                      From Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      To Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.transfers &&
                    Array.isArray(transactionHistory.transfers) &&
                    [...transactionHistory.transfers]
                      .reverse()
                      .filter(
                        (tx) =>
                          tx.from === walletAddress || tx.to === walletAddress
                      )
                      .map((tx, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">
                            {tx.from.toLowerCase() ===
                            walletAddress.toLowerCase()
                              ? "Accepted Offer"
                              : tx.from.toLowerCase() ===
                                "0x01ff83b084498cfda27497f14d5c2adbb5a7f73d"
                              ? "Claimed Token"
                              : tx.category === "erc721"
                              ? "Minted NFT"
                              : ""}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`https://polygonscan.com/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {tx.hash}
                            </a>
                          </td>
                          <td className="px-6 py-4">{tx.from}</td>
                          <td className="px-6 py-4">{tx.to}</td>
                          <td className="px-6 py-4">{tx.category}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </Tabs.Panel>

          {/* Meetings Tab Panel */}
          <Tabs.Panel value="meetings" pt="xs">
            <div className="space-y-4">
              {meetings.length > 0 ? (
                meetings.map((meeting, index) => (
                  // Layout for each meeting item
                  <div key={index} className="p-4 bg-white rounded-lg shadow">
                    <p>
                      <strong>Meeting ID:</strong> {meeting.id}
                    </p>
                    <p>
                      <strong>Meeting Link:</strong>{" "}
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {meeting.meetingLink}
                      </a>
                    </p>
                    <p>
                      <strong>Scheduled Time:</strong>{" "}
                      {new Date(meeting.scheduledTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {meeting.status}
                    </p>

                    {/* Action Buttons */}
                    {meeting.status === "Invited" && (
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-green-500 text-white p-2 rounded mr-2"
                          onClick={() => handleAcceptMeeting(meeting.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded"
                          onClick={() => handleCancelMeeting(meeting.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {meeting.status === "scheduled" && (
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-red-500 text-white p-2 rounded"
                          onClick={() => handleCancelMeeting(meeting.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Text align="center" size="md" color="gray">
                  No meetings scheduled.
                </Text>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="assessments" pt="xs">
            {assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.map((assessment, index) => (
                  <div key={index} className="p-4 bg-white shadow rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text size="md" weight={500}>
                          {assessment.title || `Assessment ${index + 1}`}
                        </Text>
                        <Text size="sm">
                          Expiry Date:{" "}
                          {new Date(
                            assessment.expiry_date
                          ).toLocaleDateString()}
                        </Text>
                      </div>
                      <Button
                        color="blue"
                        onClick={() =>
                          router.push(`/assessment/${assessment.companyID}`)
                        } // Assuming companyID can be used to navigate to the specific assessment
                      >
                        Take Assessment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text align="center" size="md" color="gray">
                No assessments available.
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Container>
      {isSubmissionStatusLoaded && !hasSubmitted && <SelfAssessmentCTA />}
    </div>
  );
};

export default Profile;
