// pages/students/[studentId].tsx
import React, { useEffect, useState, FC } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import JobToken from "../contracts/JobToken.json";
import {
  Alert,
  Paper,
  Loader,
  Title,
  Text,
  Image,
  Container,
  Grid,
  Card,
  Divider,
  Group,
  Center,
  Button,
  Stack,
} from "@mantine/core";
import {
  FaEthereum,
  FaRegSadCry,
  FaEnvelope,
  FaWallet,
  FaCoins,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from "axios";
import Layout from "./../Layout";
import { Dialog } from "@headlessui/react";
import SHA256 from "crypto-js/sha256";

interface Student {
  id: number;
  email: string;
  walletAddress: string;
  FirstName: string;
  LastName: string;
  imageURL: string;
}

interface NFT {
  image: string;
  name: string;
  description: string;
}

const NFTCard: FC<NFT> = ({ image, name, description }) => {
  return (
    <Card shadow="sm" p="xl">
      <Card.Section>
        <Image src={image} alt={name} height={200} width="100%" />
      </Card.Section>
      <Title order={4} mt="md">
        {name}
      </Title>
      <Text color="dimmed" size="sm">
        {description}
      </Text>
    </Card>
  );
};

const StudentDetail: FC = () => {
  const router = useRouter();
  const { studentId } = router.query;
  const [student, setStudent] = useState<Student | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNfts, setLoadingNfts] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [isHovered, setIsHovered] = useState(false);

  const handleIconClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchNfts = async (walletAddress: string) => {
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

  // Function to display a shortened hash
  const getShortenedHash = (hash) => {
    return hash.substring(0, 6) + "..." + hash.substring(hash.length - 6);
  };

  useEffect(() => {
    if (typeof studentId === "string") {
      const fetchStudent = async () => {
        try {
          // Fetch student details
          const response = await fetch(
            `/api/getStudentInfoById?studentId=${studentId}`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          let data: Student = await response.json();
          
          if (!localStorage.getItem("token")) {
            data = {
              ...data,
              email: getShortenedHash(SHA256(data.email).toString()),
            };
          }
          setStudent(data);

          // Fetch token balance
          const provider = new ethers.providers.JsonRpcProvider(
            "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
          );
          const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";
          const contract = new ethers.Contract(
            contractAddress,
            JobToken.abi,
            provider
          );
          const balance = await contract.balanceOf(data.walletAddress);
          setBalance(parseFloat(ethers.utils.formatUnits(balance, 18)));

          // Fetch NFTs
          fetchNfts(data.walletAddress);

          setLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching student data:", error);
            setError(error);
            setLoading(false);
          }
        }
      };

      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <Layout title="Loading..." description="Loading student details">
        <Center style={{ height: "100vh" }}>
          <Loader size="xl" variant="dots" />
          <Text size="lg" ml="xl">
            Loading student details...
          </Text>
        </Center>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" description="An error occurred">
        <Container>
          <Alert
            icon={<FaRegSadCry size={16} />}
            title="Error"
            color="red"
            mb="md"
          >
            {error.message}
          </Alert>
          <Center style={{ height: "100vh" }}>
            <Button onClick={() => router.push("/students")} color="blue">
              Back to Students List
            </Button>
          </Center>
        </Container>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout title="Not Found" description="Student not found">
        <div>Student not found</div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${student.FirstName} ${student.LastName}`}
      description={`Details of ${student.FirstName} ${student.LastName}`}
    >
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Profile Section */}
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <img
                src={student.imageURL || "/sample-profile.png"}
                alt={`${student.FirstName} ${student.LastName}`}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h1 className="text-2xl font-semibold mb-2">
                {student.FirstName} {student.LastName}
              </h1>
              <p className="text-gray-500 mb-4">Student ID {student.id}</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-lg font-medium">Email</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaWallet className="text-gray-500" />
                  <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                      setIsHovered(false);
                      setCopyText("Copy");
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(student.walletAddress);
                      setCopyText("Copied!");
                    }}
                    className="cursor-pointer"
                  >
                    <p className="text-lg font-medium">Wallet Address</p>
                    <p className="text-sm text-gray-600">
                      {student.walletAddress.substring(0, 6) +
                        "..." +
                        student.walletAddress.substring(
                          student.walletAddress.length - 4
                        )}
                      {isHovered && (
                        <span className="ml-2 text-blue-500 text-xs">
                          {copyText}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FaCoins className="text-gray-500" />
                  <div>
                    <p className="text-lg font-medium">Job Tokens</p>
                    <p className="text-sm text-gray-600">{balance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Collection */}
          <div className="col-span-1 md:col-span-9">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">NFT Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts
                  .filter(
                    (nft) =>
                      nft.description?.toLowerCase().includes("course") ||
                      nft.description?.toLowerCase().includes("tier")
                  )
                  .map((nft, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-lg shadow-inner cursor-pointer"
                      onClick={() => openModal(nft.image_url)}
                    >
                      <img
                        src={nft.image_url}
                        alt={nft.name}
                        className="mb-2 rounded-lg w-full"
                      />
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium mb-2">{nft.name}</h3>
                        <a
                          href={`https://rarible.com/token/${nft.blockchain.toLowerCase()}/${
                            nft.contract
                          }:${nft.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 transition"
                          onClick={handleIconClick}
                        >
                          <FaGlobe />
                        </a>
                      </div>
                      <p className="text-sm text-gray-600">{nft.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Image Zoom Modal */}
          <Dialog
            open={isModalOpen}
            onClose={closeModal}
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-0" />
            <div className="min-h-screen px-4 text-center flex items-center justify-center">
              <Dialog.Title className="text-lg font-medium hidden">
                Click anywhere outside the image to close
              </Dialog.Title>
              <div className="mt-4 flex justify-center items-center p-4 bg-white rounded-lg shadow">
                <img
                  src={selectedImage}
                  alt="Zoomed NFT"
                  className="max-w-full max-h-full h-auto"
                  style={{ maxHeight: "80vh" }} // Limit the height to 80% of the viewport height
                />
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetail;
