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

function Students() {
  const [students, setStudents] = useState([]);
  const [balances, setBalances] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [copyStatus, setCopyStatus] = useState({});

  const handleCopy = (event, id, walletAddress) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(walletAddress);
    setCopyStatus({ ...copyStatus, [id]: "Copied!" });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: "Copy" }), 2000);
  };

  useEffect(() => {
    // Fetch students from the API
    fetch("/api/getStudentsInfo")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
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
        "https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL" // Adjust this URL to your network
      );
      const contractAddress = "0xc104e87E8769981FeAA64666164adeEeba4A0C8d"; // Adjust this to your contract address
      const contract = new ethers.Contract(
        contractAddress,
        JobToken.abi,
        provider
      );

      const newBalances = {};

      for (const student of students) {
        try {
          const balance = await contract.balanceOf(student.walletAddress);
          newBalances[student.id] = parseFloat(
            ethers.utils.formatUnits(balance, 18)
          );
        } catch (error) {
          console.error(
            `Error fetching balance for student ${student.id}:`,
            error
          );
        }
      }

      setBalances(newBalances);
      setLoading(false);
    };

    if (students.length > 0) {
      fetchBalances();
    }
  }, [students]);

  let filteredStudents = students.filter((student) =>
    `${student.FirstName} ${student.LastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sort filteredStudents based on sortOrder
  if (sortOrder === "highest") {
    filteredStudents = filteredStudents.sort(
      (a, b) => (balances[b.id] || 0) - (balances[a.id] || 0)
    );
  } else if (sortOrder === "lowest") {
    filteredStudents = filteredStudents.sort(
      (a, b) => (balances[a.id] || 0) - (balances[b.id] || 0)
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout
      title={"Students and Job Tokens"}
      description={"Listing of Students and their Job Token Balances"}
    >
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-5xl">
        <Title
          order={3}
          className="text-center font-bold mb-6 sm:mb-10 text-3xl"
        >
          Students
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
          <div className="flex items-center border border-gray-200 rounded-lg p-2">
            <Select
              data={[
                { label: "Sort by Job Tokens", value: "" },
                { label: "Highest to Lowest", value: "highest" },
                { label: "Lowest to Highest", value: "lowest" },
              ]}
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              className="border-0"
            />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded shadow-md">
          {error && <div className="text-red-500 mb-4">{error.message}</div>}
          {loading ? (
            <Loader />
          ) : (
            <Grid gutter="md">
              {filteredStudents.map((student) => (
                <Col key={student.id} md={6}>
                  <Link href={`/students/${student.id}`} passHref>
                    <Paper
                      elevation={3}
                      className="p-4 transition-all duration-300 transform hover:scale-105 rounded-lg border border-gray-200 flex"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={student.imageURL || "/sample-profile.png"}
                          alt={`${student.FirstName} ${student.LastName}`}
                          className="w-20 h-20 rounded-full object-cover"
                          style={{ maxWidth: "125px", maxHeight: "125px" }}
                        />
                      </div>
                      <div className="ml-6 flex-grow">
                        <div>
                          <Text
                            size="xl"
                            weight={700}
                          >{`${student.FirstName} ${student.LastName}`}</Text>
                          <Text color="gray">{student.email}</Text>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center mt-2">
                            <i className="fas fa-wallet mr-2"></i>
                            <div
                              className="flex justify-between items-center bg-gray-100 border rounded-lg px-3 py-1 w-full cursor-pointer hover:bg-gray-200 transition"
                              onClick={(event) =>
                                handleCopy(
                                  event,
                                  student.id,
                                  student.walletAddress
                                )
                              } // Passing event here
                              onMouseEnter={() =>
                                setCopyStatus({
                                  ...copyStatus,
                                  [student.id]: "Copy",
                                })
                              }
                            >
                              <Text size="lg">
                                {student.walletAddress.slice(0, 9) +
                                  "............" +
                                  student.walletAddress.slice(-9)}
                              </Text>
                              <div className="ml-2">
                                {copyStatus[student.id] ? (
                                  copyStatus[student.id] === "Copied!" ? (
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
                              JT
                            </Badge>
                            <div className="bg-gray-100 border rounded-lg px-3 py-1 inline-block">
                              <Text size="lg">
                                <span className="font-bold">Job Tokens</span>
                                <span className="ml-2">
                                  {balances[student.id] || 0}
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

export default Students;
