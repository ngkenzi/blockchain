// pages/companies/[companyId].tsx
import React, { useEffect, useState } from "react";
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
  Button,
  Center,
  Modal,
} from "@mantine/core";
import { FaEnvelope, FaWallet, FaCoins, FaRegSadCry } from "react-icons/fa";
import Layout from "../Layout";
import axios from "axios";

interface Company {
  id: number;
  name: string;
  email: string;
  wallet_address: string;
  profile_picture: string;
  // Additional properties for company
}

interface JobOffer {
  id: number;
  position: string;
  jobDescription: string;
  salary: number;
  jobType: string;
  // Additional properties for job offer
}

const CompanyDetail = () => {
  const router = useRouter();
  const { companyId } = router.query;
  const [company, setCompany] = useState<Company | null>(null);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [experience, setExperience] = useState("0");
  const [studentId, setStudentId] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    setWalletAddress(localStorage.getItem("walletAddress"));
  }, [router]);

  const fetchStudentInfo = async () => {
    if (walletAddress) {
      try {
        const response = await axios.get(
          `/api/getStudentInfoByWalletAddress?walletAddress=${walletAddress}`
        );
        const studentData = response.data;
        setStudentId(studentData.id);
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, [walletAddress]);

  useEffect(() => {
    if (typeof companyId === "string") {
      const fetchCompanyAndJobs = async () => {
        try {
          // Fetch company details
          const response = await fetch(
            `/api/getCompanyProfile?companyId=${companyId}`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: Company = await response.json();

          setCompany(data);

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
          const balance = await contract.balanceOf(data.wallet_address);
          setBalance(parseFloat(ethers.utils.formatUnits(balance, 18)));

          // Fetch job offers
          const jobOffersResponse = await fetch(
            `/api/jobOffers?companyId=${companyId}`
          );

          if (!jobOffersResponse.ok) {
            throw new Error("Network response was not ok for job offers");
          }
          const jobOffersData: JobOffer[] = await jobOffersResponse.json();
          setJobOffers(jobOffersData);

          setLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching company data:", error);
            setError(error);
            setLoading(false);
          }
        }
      };

      fetchCompanyAndJobs();
    }
  }, [companyId]);

  const handleApplyClick = (jobOffer: JobOffer) => {
    setSelectedJob(jobOffer);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (event) => {
    event.preventDefault();

    const companyId =
      typeof router.query.companyId === "string"
        ? parseInt(router.query.companyId)
        : null;

    console.log(companyId);

    try {
      await axios.post("/api/applyForJob", {
        jobId: selectedJob.id,
        studentId,
        companyId,
        experience,
      });

      console.log(selectedJob.id);
      console.log(studentId);

      alert("Application submitted successfully!");
      setIsApplyModalOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  if (loading) {
    return (
      <Layout title="Loading..." description="Loading company details">
        <Center style={{ height: "100vh" }}>
          <Loader size="xl" variant="dots" />
          <Text size="lg" ml="xl">
            Loading company details...
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
            <Button onClick={() => router.push("/companies")} color="blue">
              Back to Companies List
            </Button>
          </Center>
        </Container>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout title="Not Found" description="Company not found">
        <div>Company not found</div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${company.name}`}
      description={`Details of ${company.name}`}
    >
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-3">
            <Paper elevation={3} p="lg" className="mb-6">
              <Image
                src={
                  company.profile_picture || "https://i.imgur.com/mCHMpLT.png"
                }
                alt={`${company.name}`}
                height={100}
                width={190}
                className="mx-auto"
              />
              <Title order={3} className="mt-4">
                {company.name}
              </Title>
              <Text size="sm" color="dimmed">
                {company.email}
              </Text>
            </Paper>
          </div>

          <div className="col-span-1 md:col-span-9">
            <Paper elevation={3} p="lg">
              <Title order={3}>Company Information</Title>
              <Text size="sm" mt="md">
                Wallet Address: {company.wallet_address}
              </Text>
              <Text size="sm" mt="md">
                Token Balance: {balance}
              </Text>
              {/* Additional company info here */}
            </Paper>
          </div>

          {/* Job Offers Section */}
          <div className="col-span-full md:col-span-12 mt-6">
            <div className="p-4 shadow-lg rounded-lg bg-white">
              <h3 className="text-lg font-semibold">Job Offers</h3>
              {jobOffers.length > 0 ? (
                <ul className="mt-4">
                  {jobOffers.map((offer) => (
                    <li
                      key={offer.id}
                      className="border-b border-gray-200 py-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div>
                            <span className="font-bold">{offer.position}</span>{" "}
                            - {offer.jobDescription}
                          </div>
                          <div className="text-sm text-gray-600">
                            Salary:{" "}
                            {offer.salary === 0
                              ? "To be determined"
                              : `$${offer.salary}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            Job Type: {offer.jobType}
                          </div>
                        </div>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleApplyClick(offer)}
                        >
                          Apply
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-gray-600">No job offers available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        opened={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setExperience("");
        }}
        title={`Apply for ${selectedJob?.position}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div className="text-lg font-semibold">{`Application form for ${selectedJob?.position}`}</div>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder={`Years of experience as ${selectedJob?.position}`}
            min="0"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Submit Application
          </button>
        </form>
      </Modal>
    </Layout>
  );
};

export default CompanyDetail;
