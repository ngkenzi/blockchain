import React, { useState } from "react";
import Head from "next/head";
import NFTViewer from "./NFTViewer";
import ChartComponent from "./ChartComponent";
import JobOffersChartComponent from "./JobOffersChartComponent";

const MSP: React.FC = () => {
  const [activeTab, setActiveTab] = useState("nfts");

  return (
    <div>
      <Head>
        <title>MSP Dashboard</title>
        <meta name="description" content="Welcome to the MSP Dashboard" />
      </Head>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-800 text-white p-5 flex flex-col">
          <h1 className="text-xl font-semibold mb-4">MSP Admin Dashboard</h1>
          <div className="flex flex-col flex-grow">
            <button
              onClick={() => setActiveTab("nfts")}
              className={`mb-2 px-2 py-1 text-sm font-semibold text-left rounded hover:bg-gray-700 transition-colors ${
                activeTab === "nfts" ? "bg-gray-700" : ""
              }`}
            >
              NFT Viewer
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-2 py-1 text-sm font-semibold text-left rounded hover:bg-gray-700 transition-colors ${
                activeTab === "charts" ? "bg-gray-700" : ""
              }`}
            >
              Charts
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 bg-gray-100 overflow-auto">
          {activeTab === "nfts" && <NFTViewer />}
          {activeTab === "charts" && (
            <div className="space-y-8">
              <ChartComponent />
              <JobOffersChartComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MSP;
