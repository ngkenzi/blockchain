import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import JobToken from "./contracts/JobToken.json";

import {
  Grid,
  Text,
  Title,
  Paper,
  Col,
  Image,
  Loader,
  Badge,
  Input,
  Select,
} from "@mantine/core";
import Layout from "./Layout";
import Link from "next/link";
import { FaCopy, FaCheck, FaSearch } from "react-icons/fa";
import SHA256 from "crypto-js/sha256";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [balances, setBalances] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copyStatus, setCopyStatus] = useState({});
  const [screenWidth, setScreenWidth] = useState(null);

  const handleCopy = (event, id, wallet_address) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(wallet_address);
    setCopyStatus({ ...copyStatus, [id]: "Copied!" });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: "Copy" }), 2000);
  };

  const getShortenedHash = (hash) => {
    return hash.substring(0, 6) + "..." + hash.substring(hash.length - 6);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);

      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const getShortenedWalletAddress = (address) => {
    if (!address) return "N/A"; // Return a placeholder or handle the undefined case

    const length = screenWidth < 768 ? 6 : 9;
    return address.slice(0, length) + "..." + address.slice(-length);
  };

  useEffect(() => {
    fetch("/api/company")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        setError(error);
      });
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL"
      );
      const contractAddress = "0x44AA144A60af0C745759912eA9C58476e49d9967";
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        provider
      );

      const newBalances = {};

      for (const company of companies) {
        try {
          const balance = await contract.balanceOf(company.wallet_address);
          console.log("Company balance: ", balance);
          newBalances[company.id] = parseFloat(
            ethers.utils.formatUnits(balance, 18)
          );
        } catch (error) {
          console.error(
            `Error fetching balance for company ${company.id}:`,
            error
          );
        }
      }

      setBalances(newBalances);
      setLoading(false);
    };

    if (companies.length > 0) {
      fetchBalances();
    }
  }, [companies]);

  let filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout
      title={"Companies and Corporate Tokens"}
      description={"Listing of Companies and their Corporate Token Balances"}
    >
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-5xl">
        <Title
          order={3}
          className="text-center font-bold mb-6 sm:mb-10 text-3xl"
        >
          Companies
        </Title>
        <div className="bg-white p-4 sm:p-6 rounded shadow-md mb-4 flex justify-between items-center border border-gray-200">
          <div className="flex-grow mr-2">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              icon={<FaSearch />}
              className="w-full"
            />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded shadow-md">
          {error && <div className="text-red-500 mb-4">{error.message}</div>}
          {loading ? (
            <Loader />
          ) : (
            <Grid gutter="md">
              {filteredCompanies.map((company) => (
                <Col key={company.id} md={6}>
                  <Link href={`/companies/${company.id}`} passHref>
                    <Paper
                      elevation={3}
                      className="p-4 transition-all duration-300 transform hover:scale-105 rounded-lg border border-gray-200 flex"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            company.profile_picture ||
                            "https://i.imgur.com/mCHMpLT.png"
                          }
                          alt={company.name}
                          className="w-20 h-20 rounded-full object-cover"
                          style={{ maxWidth: "125px", maxHeight: "125px" }}
                        />
                      </div>
                      <div className="ml-6 flex-grow">
                        <div>
                          <Text size="xl" weight={700}>
                            {company.name}
                          </Text>
                          <Text color="gray">{company.email}</Text>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center mt-2">
                            <i className="fas fa-wallet mr-2"></i>
                            <div
                              className="flex justify-between items-center bg-gray-100 border rounded-lg px-3 py-1 w-auto cursor-pointer hover:bg-gray-200 transition"
                              onClick={(event) =>
                                handleCopy(
                                  event,
                                  company.id,
                                  company.wallet_address
                                )
                              }
                              onMouseEnter={() =>
                                setCopyStatus({
                                  ...copyStatus,
                                  [company.id]: "Copy",
                                })
                              }
                            >
                              <Text size="lg">
                                {getShortenedWalletAddress(
                                  company.wallet_address
                                )}
                              </Text>
                              <div className="ml-2">
                                {copyStatus[company.id] ? (
                                  copyStatus[company.id] === "Copied!" ? (
                                    <FaCheck />
                                  ) : (
                                    <FaCopy />
                                  )
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center mt-2">
                            <Badge color="blue" className="mr-2">
                              CT
                            </Badge>
                            <div className="bg-gray-100 border rounded-lg px-3 py-1 inline-block">
                              <Text size="lg">
                                <span className="font-bold">Job Tokens</span>
                                <span className="ml-2">
                                  {balances[company.id] || 0}
                                </span>
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </Link>
                </Col>
              ))}
            </Grid>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Companies;
