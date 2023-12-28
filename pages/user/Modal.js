import React, { useState, useEffect } from "react";
import Head from "next/head";
import EmploymentBadge from "./EmploymentBadge";
import Minter from "./Minter";
import { useRouter } from "next/router";
import { BeatLoader } from 'react-spinners';
import { FaTimes, FaSignOutAlt, FaCheckCircle, FaHourglassStart, FaSpinner, FaEdit, FaCoins, FaLayerGroup } from "react-icons/fa"; // Icons from react-icons

const Modal = ({ closeModal, student, studentId, date, company, walletAddress }) => {
    const [course, setCourse] = useState("");
    const [generatedImageData, setGeneratedImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMinting, setIsMinting] = useState(false);

    const uniAddress = "0xbaeb7bcfa679bf0132df2a1b8d273f327cfb0542";

    const router = useRouter();
    const [step, setStep] = useState(1);

    const handleImageGenerate = (imgData) => {
        setGeneratedImageData(imgData);
        setStep(2);
    };

    const onMintingComplete = () => {
        setIsMinting(false); // Reset minting status
        setTimeout(() => {
            closeModal();
        }, 3000);
    };

    const onMintingStart = () => {
        setIsMinting(true);
    };

    function StepIndicator({ currentStep }) {
        const steps = [
            { number: 1, label: "Generating Certificate", icon: <FaHourglassStart /> },
            { number: 2, label: "Minting", icon: <FaCoins /> }
        ];

        return (
            <div className="flex justify-center items-center space-x-4 my-8">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        {/* Step Circle */}
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep === step.number ? 'bg-blue-600' : currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'} text-white`}
                        >
                            {currentStep === step.number && step.number === 2 ? (
                                <FaSpinner className="animate-spin" />
                            ) : currentStep > step.number ? (
                                <FaCheckCircle />
                            ) : (
                                step.icon
                            )}
                        </div>
                        {/* Step Label */}
                        <span className={`ml-2 ${currentStep === step.number ? 'text-blue-600' : currentStep > step.number ? 'text-green-500' : 'text-gray-400'}`}>
                            {step.label}
                        </span>

                        {/* Connector Line (if not the last item) */}
                        {index < steps.length - 1 && (
                            <div className="w-4 border-t-2 transition-all duration-300 mx-2 border-gray-300"></div>
                        )}
                    </div>
                ))}
            </div>
        );
    }


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                {/* X button */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed"
                    disabled={isMinting}>
                    <FaTimes />
                </button>
                <StepIndicator currentStep={step} />

                {step === 1 && (
                    <div className="relative flex justify-center items-center min-h-screen">
                        <BeatLoader color="#3498db" className="absolute z-10 top-1/4" />
                        <EmploymentBadge
                            className="absolute z-0"
                            student={student}
                            studentId={studentId}
                            date={date}
                            company={company}
                            onImageGenerate={handleImageGenerate}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="mb-3">
                        <Minter
                            generatedImageData={generatedImageData}
                            student={student}
                            studentId={parseInt(studentId)}
                            courseName={company}
                            courseDate={date}
                            walletAddress={walletAddress}
                            uniAddress={uniAddress}
                            onMintingStart={onMintingStart}
                            onMintingComplete={onMintingComplete}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
