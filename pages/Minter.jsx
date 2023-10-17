import { Input, Alert, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { NFTStorage } from "nft.storage";
const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE4OGUwYzhCZjNFZTJlN2IzOGMzRTE5M0M1RDlmOUQ3NjU1NzhFOTYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MTU3Mjg4MTY3OCwibmFtZSI6IlVuaUNlcnQifQ.Zo89YeyQW0XnL15G9-9agkMM9BAda6VDkEoDAvvHFr8";
import LazyMinter from "./helper/LazyMinter";
import axios from "axios";
import { useRef } from "react";

let tokenId = 1;

async function mintNFT({
  setStatus,
  image,
  name,
  description,
  minPrice,
  generatedImageData,
  studentId,
  walletAddress,
  ownerType,
}) {
  //setStatus({ type: "loading", msg: "Uploading..." });

  let imageFile = image;

  if (generatedImageData) {
    const dataURI = generatedImageData;
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    imageFile = blob;
    console.log(blob);
  }

  try {
    const { data } = await axios.post("/api/nftStorage", {
      name,
      description,
      studentId,
      ownerType, 
      image: generatedImageData, 
    });

    setStatus({ type: "success", msg: "Upload complete!" });

    // Assuming that the metadata URL is returned by the server
    const metadataUrl = data.url;
    let cid = metadataUrl.replace(/^ipfs:\/\//, "");
    cid = cid.replace("/metadata.json", "");

    const lazyMinter = new LazyMinter();

    const id = await getNumberOfRow();

    const voucher = await lazyMinter.createVoucher(
      id,
      metadataUrl,
      minPrice.toString()
    );

    axios
      .post("/api/create", {
        cid: cid,
        name: name,
        description: description,
        minPrice: 0.0,
        tokenId: id,
        uri: metadataUrl,
        signature: voucher.signature,
        studentId: studentId,
        walletAddress: walletAddress,
      })
      .then((resp) => {})
      .catch((err) => {
        console.log("error", err);
      });

    return { voucher, cid };
  } catch (err) {
    console.log("error", err);
    setStatus({
      type: "error",
      msg: "An error occurred while uploading the NFT. Please try again.",
    });
  }
}

async function getNumberOfRow() {
  return axios
    .get("/api/getNumberOfRow")
    .then((response) => {
      let value = response.data[0]["MAX(id)"];
      // if (response.data[0]["MAX(id)"] == null) {
      //   return 1;
      // }
      return value + 6100;
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function Minter({
  web3Modal,
  loadWeb3Modal,
  price,
  generatedImageData,
  student,
  studentId,
  courseName,
  courseDate,
  walletAddress,
  uniAddress,
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const [nftName, setName] = useState(student);
  const [studentID, setStudentID] = useState(studentId);

  const [description, setDescription] = useState(
    `${courseName}, ${courseDate}`
  );

  const [minPrice, setPrice] = useState("");
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [tokenId, setTokenId] = useState(null);
  const [mintComplete, setMintComplete] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [matic, setMatic] = useState(0);

  useEffect(() => {
    setName(student);
  }, [student]);

  useEffect(() => {
    setDescription(`Course Name: ${courseName}, Course Data: ${courseDate}`);
  }, [courseName, courseDate]);

  useEffect(() => {
    setStudentID(studentId);
  }, [studentId]);

  const beforeUpload = (file) => {
    if (file) {
      setFile(file);
      setPreviewURL(URL.createObjectURL(file));
    } else if (generatedImageData) {
      setFile(null);
      setPreviewURL(generatedImageData);
    }
  };

  const btnStyle = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 16,
    color: "green",
    fontFamily: "monospace",
    fontWeight: "700",
  };

  //Handle drop function to allow file drop as an additional option
  const [fileList, setFileList] = useState([]);
  const handleDrop = (e) => {
    e.preventDefault();
    beforeUpload(e.dataTransfer.files?.[0]);
  };

  const uploadButton = (
    <div className="flex justify-center items-center">
      <button className="font-mono text-gray-100 bg-cyan-500 font-semibold text-lg focus:outline-none mx-3">
        Choose image
      </button>{" "}
      or <span className="mx-2"> Drop image</span>
    </div>
  );

  const statusDisplay = () => {
    switch (status.type) {
      case "loading":
        return <Spin tip={status.msg} />;
      case "success":
        return <Alert message={status.msg} type="success" />;
      case "error":
        return <Alert message={status.msg} type="error" />;
      default:
        return null;
    }
  };

  const uploadView = (
    <div
      onClick={() => inputRef?.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-green-500 p-6 rounded-md hover:bg-green-100 transition-all duration-200 ease-in-out"
    >
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={(e) => beforeUpload(e.target.files?.[0])}
      />
      {uploadButton}
    </div>
  );

  const preview =
    previewURL || generatedImageData ? (
      <img
        src={previewURL || generatedImageData}
        style={{
          maxWidth: "700px",
          height: "500px",
          width: "100%",
          objectFit: "contain",
        }}
      />
    ) : (
      <div style={{ display: "none" }} />
    );

  const inputStyle = {
    borderBottom: "1.5px solid black",
    borderLeft: "none",
    borderRight: "none",
    borderTop: "none",
    outline: "none",
    borderRadius: 0,
    width: "420px",
    padding: "10px 6px",
    display: "block",
  };

  const nameField = (
    <Input
      className="border-2 border-black outline-none rounded-none w-96 px-2 py-2.5 block"
      placeholder="Enter a name"
      value={nftName}
      disabled
      onChange={(e) => {
        setName(e.target.value);
      }}
      style={{ color: "#333" }}
    />
  );

  const descriptionField = (
    <Input
      className="border-2 border-black outline-none rounded-none w-96 px-2 py-2.5 block"
      placeholder="Enter a description"
      value={description}
      disabled
      onChange={(e) => {
        setDescription(e.target.value);
      }}
      style={{ color: "#333" }}
    />
  );

  const studentIdField = (
    <Input
      className="border-2 border-black outline-none rounded-none w-96 px-2 py-2.5 block"
      placeholder="Enter a studentID"
      value={studentId}
      disabled
      onChange={(e) => {
        setStudentID(e.target.value);
      }}
      style={{ color: "#333" }}
    />
  );

  const mintEnabled = generatedImageData != null && !!nftName;

  const startMinting = async () => {
    setMinting(true);

    // First NFT with walletAddress
    try {
      const response1 = await mintNFT({
        setStatus,
        name: nftName,
        image: file,
        description,
        minPrice: matic,
        generatedImageData,
        studentId,
        walletAddress,
        ownerType: "student",
      });

      if (response1.voucher) {
        console.log("First minting complete with walletAddress");
      }
    } catch (error) {
      console.log("Error during first minting:", error);
      setMinting(false);
      return; 
    }

    // Second NFT with uniAddress
    try {
      const response2 = await mintNFT({
        setStatus,
        name: nftName,
        image: file,
        description,
        minPrice: matic,
        generatedImageData,
        studentId,
        walletAddress: uniAddress,
        ownerType: "university",
      });

      if (response2.voucher) {
        console.log("Second minting complete with uniAddress");
        setTokenId(response2.voucher.tokenId); 
        setMintComplete(true);
      }
    } catch (error) {
      console.log("Error during second minting:", error);
    }

    setMinting(false);
  };

  console.log(mintComplete);

  const mintButton = !mintComplete && (
    <button
      disabled={!mintEnabled || minting || mintComplete}
      onClick={startMinting}
      className={`px-4 py-2 rounded text-white font-bold ${
        mintEnabled && !minting
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {minting ? <LoadingOutlined /> : "Create NFT!"}
    </button>
  );

  const minterForm = (
    <div
      className="flex flex-col items-center sm:pt-0 md:px-4"
      style={{ minHeight: "50vh" }}
    >
      <h1 className="text-center w-full py-4 text-4xl font-bold text-blue-700">
        Summary
      </h1>
      <div className="w-full sm:max-w-7xl sm:px-4 lg:px-6 bg-white rounded-lg shadow mt-6 py-4 ">
        <div className="flex flex-col items-center justify-between lg:flex-row lg:mx-10">
          <div className="flex flex-col items-center lg:mb-0">
            {file == null && !generatedImageData}
            {(file != null || generatedImageData) && preview}
          </div>

          {/*Field section*/}
          <div className="flex flex-col items-center space-y-4 lg:items-start lg:mt-16">
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              {nameField}
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              {descriptionField}
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                StudentID
              </label>
              {studentIdField}
            </div>
            <div className="mt-2 flex justify-center w-full">{mintButton}</div>
            <div className="h-20">
              <div className="h-20">{statusDisplay()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return minterForm;
}
