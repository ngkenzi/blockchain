import LazyMinter from "./helper/LazyMinter";
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
const DEFAULT_CONTRACT_NAME = "LazyNFT";
import { useRouter } from "next/router";

// rewrite ipfs:// uris to dweb.link gateway URLs
function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
}

export default function NFTViewer() {
  const [galleryList, setGalleryList] = useState([]);
  const [redeeming, setRedeeming] = useState(false);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCid, setCurrentCid] = useState(null);

  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [currentMintCid, setCurrentMintCid] = useState(null);
  const [currentTokenId, setCurrentTokenId] = useState(null);

  const [itemsToMint, setItemsToMint] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function handleMint(items) {
    setIsMintModalOpen(true);

    // Sort items by tokenId in ascending order
    items.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));

    for (const item of items) {
      console.log("Starting minting for tokenId:", item.tokenId); // Log to observe the order
      await redeem(item.cid, item.tokenId);
      console.log("Finished minting for tokenId:", item.tokenId); // Log to observe when minting is done

      // Introduce a delay before the next transaction
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds delay
    }
  }

  function confirmMint() {
    if (itemsToMint.length > 0) {
      handleMint(itemsToMint);
      setItemsToMint([]);
    }
    setIsMintModalOpen(false);
  }

  async function redeem(cid, tokenId) {
    setRedeeming(true);
    try {
      const response = await axios.get(`/api/getDetailsFromCid?cid=${cid}`);
      const output = response.data;
      var lazyMinter = new LazyMinter();
      var response = await lazyMinter.redeem(output[0], tokenId);
      updateRedeem(cid);
    } catch (error) {
      console.error("Detailed Error:", JSON.stringify(error, null, 2));
    } finally {
      setRedeeming(false);
    }
    return;
  }

  async function updateRedeem(cid) {
    try {
      const response = await axios.get(`/api/updateDetailsFromCid?cid=${cid}`);
      const data = response.data;
      console.log("Details updated successfully:", data);
      setGalleryList((prevList) => prevList.filter((item) => item.cid !== cid));
    } catch (error) {
      console.error("An error occurred while updating details:", error);
    }
  }

  async function fetchIpfsJsonFromCid(cid) {
    const url = "https://" + cid + ".ipfs.nftstorage.link/metadata.json";
    const resp = await fetch(url);
    return resp.json();
  }

  async function convertToDecimal(hex) {
    const value = parseInt(hex.hex, 16);

    return value / 100;
  }

  function handleDelete(cid) {
    setCurrentCid(cid);
    setIsModalOpen(true);
  }

  function confirmDelete() {
    if (currentCid) {
      deleteNFTItem(currentCid);
      setCurrentCid(null);
    }
    setIsModalOpen(false);
  }

  async function deleteNFTItem(cid) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/deleteNFTItem?cid=${cid}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Item deleted successfully!");
          setGalleryList((prevList) =>
            prevList.filter((item) => item.cid !== cid)
          );
        } else {
          const data = await response.json();
          alert(data.error || "Failed to delete the item.");
        }
      } catch (error) {
        alert("An error occurred while deleting the item.");
      }
    }
  }

  async function fetchNFTDetails() {
    const response = await axios.get("/api/getNFTDetails");
    const data = response.data;
    console.log(data);
    return data;
  }

  function ConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Item
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm leading-5 text-gray-500">
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  onClick={onConfirm}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Delete
                </button>
              </span>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                <button
                  onClick={onClose}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Cancel
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function MintConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mint Item
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm leading-5 text-gray-500">
                      Are you sure you want to mint this item? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  onClick={onConfirm}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Mint
                </button>
              </span>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                <button
                  onClick={onClose}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Cancel
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticatedAdmin");
    router.push("/authentication");
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticatedAdmin");

    // if (!isAuthenticated) {
    //   router.push("/authentication");
    // }

    async function fetchData() {
      const data = await fetchNFTDetails();
      console.log(data);

      const list = data.map(async (item) => {
        const metadata = await fetchIpfsJsonFromCid(item.cid);
        const imageURL = makeGatewayURL(metadata.image);

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          imageURL,
          cid: item.cid,
          tokenId: item.tokenId,
          studentID: item.studentID,
        };
      });

      Promise.all(list).then((resolvedList) => {
        const sortedList = resolvedList.sort((a, b) => b.id - a.id);
        setGalleryList(sortedList);
      });
    }

    fetchData();
  }, [router]);

  return (
    <div className="flex h-screen ">
      <div className="bg-white w-1/9 p-8 border-r flex flex-col justify-between">
        <div>
          <h1 className="text-2xl mb-6 font-semibold">Admin Panel</h1>
          <ul>
            <li className="mb-2 hover:text-blue-600 cursor-pointer">
              Manage NFTs
            </li>
          </ul>
        </div>
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300 w-full text-center"
        >
          Logout
        </button> */}
      </div>

      <div className="flex-1 p-10">
        <h2 className="text-xl font-semibold mb-6">NFT Management</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-full border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {redeeming ? (
            <div className="col-span-full flex justify-center items-center h-60">
              Loading...
            </div>
          ) : (
            (() => {
              const filteredItems = galleryList.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              const groupedItems = filteredItems.reduce((acc, item) => {
                if (item.studentID === undefined) {
                  console.error("Undefined studentID found in item:", item);
                }

                const key =
                  item.studentID !== null && item.studentID !== undefined
                    ? item.studentID.toString()
                    : "null";

                acc[key] = acc[key] || [];
                acc[key].push(item);

                return acc;
              }, {});

              return Object.values(groupedItems).map((items) => (
                <div
                  className="border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  key={items[0].id}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {items[0].name}
                  </h2>
                  <p className="text-gray-600 mb-4">{items[0].description}</p>
                  <img
                    src={items[0].imageURL}
                    alt={items[0].name}
                    className="w-full h-56 object-cover mb-4 rounded"
                  />
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                      onClick={() => {
                        setItemsToMint(items); // set items to be minted
                        setIsMintModalOpen(true); // open the modal
                      }}
                    >
                      Mint
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                      onClick={() => handleDelete(items[0].cid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ));
            })()
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <MintConfirmModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        onConfirm={confirmMint}
      />
    </div>
  );
}
