import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import axiosRetry from "axios-retry";
import {
  Grid,
  Text,
  Input,
  Title,
  Paper,
  Col,
  Image,
  Select,
} from "@mantine/core";
import { HeaderResponsive } from "../components/Header";
import { FooterLinks } from "../components/Footer";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import { FaUniversity, FaUser } from "react-icons/fa";
import Layout from "./Layout";
import SelfAssessmentCTA from "../components/SelfAssessmentCTA";
interface NFT {
  name: string;
  description: string;
  image_url: string;
  tokenId: string;
  contract: string;
  blockchain: string;
  studentID?: string;
  imageURL?: string;
}
import { useRouter } from "next/router";

const Search = () => {
  const [address, setAddress] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [search, setSearch] = useState("");
  const network_id = "137";
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"SignIn" | "SignUp">("SignUp");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);

  const router = useRouter();

  const fetchUniversities = async () => {
    try {
      const response = await axios.get("/api/universities");
      if (Array.isArray(response.data)) {
        return response.data.map((university) => ({
          label: university.university_name,
          value: university.wallet_address,
        }));
      } else {
        console.error("Received data is not an array");
        return [];
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
      return [];
    }
  };

  const checkSubmission = async () => {
    const userWAddress = localStorage.getItem("walletAddress");
    try {
      const response = await axios.get(
        `/api/checkSubmissionStatus?walletAddress=${userWAddress}`
      );
      if (response.data.exists) {
        setHasSubmitted(true);
      }
      setIsSubmissionStatusLoaded(true);
    } catch (error) {
      console.error("Error checking submission status:", error);
      setIsSubmissionStatusLoaded(true);
    }
  };

  useEffect(() => {
    checkSubmission();
  }, []);

  useEffect(() => {
    const getUniversities = async () => {
      const universities = await fetchUniversities();
      setUniversities(universities);
    };
    getUniversities();
  }, []);

  const [universityName, setUniversityName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const axiosInstance = axios.create();
  axiosRetry(axiosInstance, { retries: 3 });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const enrichNFTDataWithDetails = async (nfts) => {
    return Promise.all(
      nfts.map(async (nft) => {
        try {
          const response = await axios.get(
            `/api/getNFTDetailsById?tokenId=${nft.tokenId}`
          );
          return {
            ...nft,
            studentID: response.data.studentID,
            imageURL: response.data.imageURL,
          };
        } catch (error) {
          console.error("Error fetching NFT details:", error);
          return nft;
        }
      })
    );
  };

  const fetchNFTs = async () => {
    let page = 1;
    let moreDataExists = true;
    let nftData: NFT[] = [];

    setLoading(true);

    while (moreDataExists) {
      let url = `/api/rarible?address=${address}`;
      try {
        const response = await axiosInstance.get(url, {
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

        // If the number of items returned is less than the limit, it means there is no more data.
        moreDataExists = pageData.length === 100;
        page++;

        // Wait for 1 second between requests to avoid rate limiting
        if (moreDataExists) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Handle rate limit error
          console.error("Rate limit exceeded. Please slow down your requests.");
          break; // break the loop if rate limit is exceeded
        } else {
          // Handle general errors
          console.error(error);
        }
      }
    }
    setLoading(false);

    nftData = await enrichNFTDataWithDetails(nftData);

    setNfts(nftData);
  };

  useEffect(() => {
    if (address) fetchNFTs();
  }, [address]);

  return (
    <Layout
      title={"Search NFT"}
      description={"Verify and Validate your certificates with MSP Cert"}
    >
      {/* <Head>
          <title>Home</title>
          <meta
            name="description"
            content="Verify and Validate your certificates with MSP Cert"
          />
        </Head>

        <HeaderResponsive links={links} toggleModal={toggleModal} /> */}
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-5xl">
        {/* Adjust container width */}
        <Title
          order={3}
          className="text-center font-bold mb-6 sm:mb-10 text-3xl"
        >
          Digital Cert in Blockchain
        </Title>
        <div className="bg-white p-4 sm:p-6 rounded shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 sm:items-end">
            <div className="w-full sm:w-1/2">
              <Text
                component="label"
                htmlFor="address-input"
                weight={700}
                className="block text-lg mb-1 text-center sm:text-left"
              >
                Select your Organisation
              </Text>
              <Select
                placeholder="Select a university"
                data={universities}
                value={address}
                onChange={setAddress}
                className="w-full p-3 text-lg rounded-md shadow-sm"
              />
            </div>
            <div className="mt-4 sm:mt-0 w-full sm:w-1/2">
              <Text
                component="label"
                htmlFor="search-input"
                weight={700}
                className="block text-lg mb-2 text-center sm:text-left"
              >
                Search Student Name
              </Text>
              <Input
                id="search-input"
                type="text"
                placeholder="Search for Students Name..."
                value={search}
                onChange={handleSearchChange}
                className="w-full p-3 text-lg rounded-md shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-64">
              <BeatLoader color={"#667EEA"} loading={loading} size={24} />
            </div>
          ) : (
            <>
              {nfts.length === 0 && address && (
                <div className="text-center mt-6 mb-6">
                  <Text size="lg" weight={700} className="text-gray-600">
                    No NFTs available for the selected university.
                  </Text>
                </div>
              )}
              <Grid gutter="md">
                {nfts
                  .filter(
                    (nft) =>
                      nft.name.toLowerCase().includes(search.toLowerCase()) &&
                      nft.description.toLowerCase().includes("course")
                  )
                  .map((nft, index) => (
                    <Col key={index} md={6} lg={4}>
                      <a
                        href={`https://rarible.com/token/${nft.blockchain.toLowerCase()}/${
                          nft.contract
                        }:${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Paper
                          elevation={3}
                          className="transition-all duration-300 transform hover:scale-105 rounded-lg"
                        >
                          <Image
                            src={nft.image_url || "/default-nft-image.jpg"}
                            alt="NFT"
                            fit="cover"
                            className="rounded-t-lg"
                          />
                          <div className="p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  nft.imageURL ||
                                  "https://i.imgur.com/mCHMpLT.png"
                                }
                                alt="Student"
                                className="h-20 w-20 object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <Text
                                size="xl"
                                weight={700}
                                className="mb-2 text-gray-700"
                              >
                                {nft.name}
                              </Text>
                              <Text size="sm" color="gray">
                                {nft.description}
                              </Text>
                              <Text size="sm" color="gray">
                                Student ID: {nft.studentID || "N/A"}
                              </Text>
                            </div>
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
                  <div className="text-center mt-6 mb-6">
                    <Text size="lg" weight={700} className="text-gray-600">
                      No NFTs match the search criteria.
                    </Text>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      {isSubmissionStatusLoaded && !hasSubmitted && <SelfAssessmentCTA />}
    </Layout>
  );
};

export default Search;
