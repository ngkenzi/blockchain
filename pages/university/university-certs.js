import Head from "next/head";
import FormComponent from "./FormComponent";
import CertificateComponent from "./CertificateComponent";
import CourseComponent from "./CourseComponent";

import Minter from "./Minter";
import { useRouter } from "next/router";
import { BeatLoader } from 'react-spinners';
import { FaSignOutAlt, FaCheckCircle, FaHourglassStart, FaSpinner, FaEdit, FaCoins, FaLayerGroup } from "react-icons/fa"; // Icons from react-icons

import React, { useState, useEffect } from "react";

function University() {
  const [student, setStudent] = useState("");
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("");
  const [generatedImageData, setGeneratedImageData] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [template, setTemplate] = useState("");
  const [universityName, setUniversityName] = useState('');
  const [uniAddress, setUniAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [step, setStep] = useState(1);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    // Also fetch wallet address here, within useEffect.
    setUniAddress(localStorage.getItem('wallet_address'));
    setUniversityName(localStorage.getItem('university_name'));

    if (!isAuthenticated) {
      router.push("/university/login");
    } else {
      setLoading(false);
    }
  }, [router]);


  const handleSubmit = ({ student, studentId, date, course, walletAddress }) => {
    setStudent(student);
    setStudentId(studentId);
    setDate(date);
    setCourse(course);
    setWalletAddress(walletAddress);
    setStep(3);
  };

  const handleTemplateSelection = (selectedTemplate) => {
    setTemplate(selectedTemplate);
    setStep(2);
  };

  const handleImageGenerate = (imgData) => {
    setGeneratedImageData(imgData);
    setStep(4);
  };

  const handleBackStep = () => {
    if (step === 4) {
      // From Minter back to Form
      setStep(1);
    }
  };

  const handleBackToTemplate = () => {
    setStep(1);
  };

  console.log(uniAddress)

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/university/login');
  }

  function StepIndicator({ currentStep }) {
    const steps = [
      { number: 1, label: "Choose Template", icon: <FaLayerGroup /> },
      { number: 2, label: "Form Entry", icon: <FaEdit /> },
      { number: 3, label: "Generating Certificate", icon: <FaHourglassStart /> },
      { number: 4, label: "Minting", icon: <FaCoins /> }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <BeatLoader color="#3498db" size={15} />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>University dashboard</title>
        <meta
          name="description"
          content="Welcome to the University Dashboard"
        />
      </Head>

      <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* UniCert in the middle */}
          <h1 className="text-3xl font-bold mx-auto">MyUniCert</h1>

          {/* Logout button on the right */}
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded shadow-md hover:bg-red-400 hover:shadow-lg transition-all duration-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>
      </nav>
      <div className="flex-grow mt-10">
        <StepIndicator currentStep={step} />
        {step === 1 && (
          <div className="mx-auto md:max-w-2xl lg:max-w-4xl flex space-x-4 justify-center mt-10">

            {/* University Template */}
            <div
              onClick={() => handleTemplateSelection("University")}
              className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg p-4 rounded border border-gray-200 hover:border-blue-400"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/assets/UniTemplate.png"
                  alt="University Template"
                  className="w-full object-cover transform transition-transform duration-300 hover:scale-110"
                />
              </div>
              <p className="text-center mt-2 text-lg font-semibold">University</p>
            </div>

            {/* Course Template */}
            <div
              onClick={() => handleTemplateSelection("Course")}
              className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg p-4 rounded border border-gray-200 hover:border-blue-400"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/assets/CourseTemplate.png"
                  alt="Course Template"
                  className="w-full object-cover transform transition-transform duration-300 hover:scale-110"
                />
              </div>
              <p className="text-center mt-2 text-lg font-semibold">Course</p>
            </div>

          </div>
        )}

        {step === 2 && (
          <div className="mx-auto md:max-w-2xl lg:max-w-4xl">
            <FormComponent onSubmit={handleSubmit} template={template} setWalletAddress={setWalletAddress} />

            {/* Go Back Button */}
            <div className="text-center mt-4">
              <button
                onClick={handleBackToTemplate}
                className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Go Back to Template Selection
              </button>
            </div>
          </div>
        )}


        {step === 3 && student && date && course && (
          <div className="relative flex justify-center items-center min-h-screen">
            <BeatLoader color="#3498db" className="absolute z-10 top-1/4" />
            {template === "University" ? (
              <CertificateComponent
                className="absolute z-0"
                student={student}
                studentId={studentId}
                date={date}
                course={course}
                onImageGenerate={handleImageGenerate}
              />
            ) : (
              <CourseComponent
                className="absolute z-0"
                student={student}
                studentId={studentId}
                date={date}
                course={course}
                onImageGenerate={handleImageGenerate}
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="mb-3">
            <Minter
              generatedImageData={generatedImageData}
              student={student}
              studentId={parseInt(studentId)}
              courseName={course}
              courseDate={date}
              walletAddress={walletAddress}
              uniAddress={uniAddress}
            />
            <div className="text-center">
              <button
                onClick={handleBackStep}
                className="mt-4 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Back to Certificate Generator
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-blue-600 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <a href="#" className="mr-4 hover:text-gray-300 transition duration-300">About Us</a>
            <a href="#" className="mr-4 hover:text-gray-300 transition duration-300">Contact</a>
            <a href="#" className="hover:text-gray-300 transition duration-300">Terms of Service</a>
          </div>
          <div>
            © {new Date().getFullYear()} MSP.dev. All rights reserved.
          </div>
        </div>
      </footer>

    </div>

  );
};

export default University;
