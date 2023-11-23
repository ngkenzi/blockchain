import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sliderDescriptions = {
    blockchainKnowledge: [
        "Limited knowledge",
        "Basic knowledge",
        "Competent",
        "Proficient",
        "Expert"
    ],
    smartContractDev: [
        "Limited proficiency",
        "Basic proficiency",
        "Competent",
        "Highly proficient",
        "Expert proficiency"
    ],
    dappDev: [
        "Limited experience",
        "Basic experience",
        "Competent",
        "Highly experienced",
        "Expert experience"
    ],
    blockchainSecurity: [
        "Limited knowledge",
        "Basic knowledge",
        "Competent",
        "Proficient",
        "Expert knowledge"
    ],
    consensusMechanisms: [
        "Limited familiarity",
        "Basic familiarity",
        "Competent",
        "Proficient",
        "Expert"
    ],
    versionControl: [
        "Limited proficiency",
        "Basic proficiency",
        "Competent",
        "Highly proficient",
        "Expert proficiency"
    ],
    problemSolving: [
        "Limited ability",
        "Basic ability",
        "Competent",
        "Highly proficient",
        "Expert"
    ],
    communicationSkills: [
        "Limited ability",
        "Basic ability",
        "Competent",
        "Highly proficient",
        "Expert"
    ],
    blockchainEcosystems: [
        "Limited awareness",
        "Basic awareness",
        "Competent",
        "Highly informed",
        "Expert"
    ],
    learningAndGrowth: [
        "Limited willingness",
        "Basic willingness",
        "Willing and capable",
        "Highly motivated",
        "Extremely motivated"
    ],
    auditSecureSmartContracts: [
        "Limited ability",
        "Basic ability",
        "Competent",
        "Proficient",
        "Expert"
    ],
    frontendTechDapp: [
        "Limited knowledge",
        "Basic knowledge",
        "Competent",
        "Proficient",
        "Expert knowledge"
    ]
};

// Component for Slider-based questions
const SliderQuestion = ({ question, onChange, value }) => (
    <div className="mb-4">
        <label className="block mb-2">{question.label}:</label>
        <input type="range" name={question.name} min="1" max="5" value={value} onChange={onChange} className="w-full" />
        <div className="text-center">{sliderDescriptions[question.name][value - 1]}</div>
    </div>
);

// Component for Checkbox-based questions
const CheckboxQuestion = ({ question, onChange, checked }) => (
    <div className="flex items-center mb-2">
        <input type="checkbox" id={question.name} name={question.name} checked={checked} onChange={onChange} className="mr-2" />
        <label htmlFor={question.name}>{question.label}</label>
    </div>
);

const Questionnaire = () => {
    const [responses, setResponses] = useState({});
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("token");
        setWalletAddress(localStorage.getItem("walletAddress"));

        if (!isAuthenticated) {
            router.prefetch("/user/login");
            router.push("/user/login");
            return;
        }
        const checkSubmission = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/check-submission/${walletAddress}`);
                if (response.data.exists) {
                    // User has already submitted, set state accordingly
                    setHasSubmitted(true);
                    toast.info("You have already submitted your assessment. Redirecting back to profile...");
                    setTimeout(() => {
                        router.push('/user/profile');
                    }, 5000);
                }
            } catch (error) {
                console.error("Error checking submission status:", error);
            }
        };

        if (walletAddress) {
            checkSubmission();
        }
    }, [walletAddress, router]);

    // All questions
    const questions = [
        // Programming Language Proficiency
        { name: 'solidity', label: 'Solidity', type: 'checkbox' },
        { name: 'go', label: 'Go', type: 'checkbox' },
        { name: 'rust', label: 'Rust', type: 'checkbox' },
        { name: 'javascript', label: 'JavaScript', type: 'checkbox' },
        { name: 'python', label: 'Python', type: 'checkbox' },
        { name: 'cpp', label: 'C++', type: 'checkbox' },
        { name: 'ruby', label: 'Ruby', type: 'checkbox' },
        { name: 'java', label: 'Java', type: 'checkbox' },
        { name: 'csharp', label: 'C#', type: 'checkbox' },
        { name: 'php', label: 'PHP', type: 'checkbox' },
        { name: 'swift', label: 'Swift', type: 'checkbox' },
        { name: 'kotlin', label: 'Kotlin', type: 'checkbox' },
        { name: 'typescript', label: 'TypeScript', type: 'checkbox' },
        { name: 'otherLanguage', label: 'Other Language (please specify)', type: 'text' },

        // Technical Skills and Expertise
        { name: 'blockchainKnowledge', label: 'Rate your understanding of how blockchain technology works', type: 'slider' },
        { name: 'smartContractDev', label: 'Rate your proficiency in developing and deploying smart contracts', type: 'slider' },
        { name: 'auditSecureSmartContracts', label: 'Rate your ability to audit and secure smart contracts', type: 'slider' },
        { name: 'dappDev', label: 'Rate your experience in developing decentralised applications (dApps)', type: 'slider' },
        { name: 'frontendTechDapp', label: 'Rate your knowledge of front-end technologies for dApp development', type: 'slider' },
        { name: 'blockchainSecurity', label: 'Rate your knowledge of common security vulnerabilities and best practices for securing blockchain applications', type: 'slider' },

        // Blockchain Ecosystem and Knowledge
        { name: 'consensusMechanisms', label: 'Rate your familiarity with different consensus mechanisms', type: 'slider' },
        { name: 'versionControl', label: 'Rate your proficiency in using collaborative development tools like GitHub', type: 'slider' },

        // Problem-Solving and Communication
        { name: 'problemSolving', label: 'Rate your ability to address complex issues and troubleshoot blockchain-related problems', type: 'slider' },
        { name: 'communicationSkills', label: 'Rate your ability to explain blockchain and smart contract concepts to non-technical stakeholders', type: 'slider' },

        // Continuous Learning and Adaptability
        { name: 'blockchainEcosystems', label: 'Rate your awareness of recent developments in the blockchain industry', type: 'slider' },
        { name: 'learningAndGrowth', label: 'Rate your willingness and ability to keep up with the rapidly evolving blockchain industry', type: 'slider' },

        // Optional Fields
        {
            name: 'smartContractExperience',
            label: 'Have you developed and deployed smart contracts in your previous work? Please provide an example and describe the purpose of the smart contract.',
            type: 'textarea'
        },
        {
            name: 'smartContractSecurity',
            label: 'How do you ensure the security and reliability of smart contracts you create? Can you describe your process for auditing and testing them for vulnerabilities?',
            type: 'textarea'
        },
        {
            name: 'dappDevelopmentExperience',
            label: "Have you worked on decentralised application (dApp) development projects? Please share details about a specific dApp you've contributed to, including the technologies and tools you used.",
            type: 'textarea'
        },
        {
            name: 'dappDevelopmentChallenges',
            label: 'What were some of the challenges you encountered during dApp development, and how did you address them?',
            type: 'textarea'
        },
        {
            name: 'portfolio',
            label: 'Insert Portfolio',
            type: 'textarea'
        },
        {
            name: 'githubContributions',
            label: 'Github Contributions',
            type: 'textarea'
        },
        {
            name: 'codingTest',
            label: 'Work Sample Coding Test (if applicable)',
            type: 'textarea'
        },
    ];

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;
        setResponses({
            ...responses,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const calculateTotalScore = () => {
        let score = 0;
        questions.forEach(question => {
            const response = responses[question.name];
            if (question.type === 'checkbox' && response) {
                score += 1; // Each selected checkbox adds 1 to the score
            } else if (question.type === 'slider') {
                score += parseInt(response || 0, 10); // Slider value is directly added to the score
            }
        });
        return score;
    };

    const determineTier = (score) => {
        if (score >= 80) return 'Expert';
        if (score >= 60) return 'Advanced';
        if (score >= 40) return 'Intermediate';
        if (score >= 20) return 'Beginner';
        return 'Novice';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const totalScore = calculateTotalScore();
        const tier = determineTier(totalScore);
        console.log(walletAddress)

        // Prepare the data to be sent to the backend
        const formData = {
            ...responses, // This includes all the responses from the form
            total_score: totalScore,
            assessment_tier: tier,
            // Add any additional fields that are required for the database but not present in the form
            wallet_address: walletAddress,
            club_wallet_address: '0xbaeb7bcfa679bf0132df2a1b8d273f327cfb0542',
            solidity: responses.solidity || false,
            go: responses.go || false,
            rust: responses.rust || false,
            javascript: responses.javascript || false,
            python: responses.python || false,
            cpp: responses.cpp || false,
            ruby: responses.ruby || false,
            java: responses.java || false,
            csharp: responses.csharp || false,
            php: responses.php || false,
            swift: responses.swift || false,
            kotlin: responses.kotlin || false,
            typescript: responses.typescript || false,
            other_language: responses.otherLanguage || '',
            blockchain_knowledge: parseInt(responses.blockchainKnowledge || 0),
            smart_contract_dev: parseInt(responses.smartContractDev || 0),
            audit_secure_smart_contracts: parseInt(responses.auditSecureSmartContracts || 0),
            dapp_dev: parseInt(responses.dappDev || 0),
            frontend_tech_dapp: parseInt(responses.frontendTechDapp || 0),
            blockchain_security: parseInt(responses.blockchainSecurity || 0),
            consensus_mechanisms: parseInt(responses.consensusMechanisms || 0),
            version_control: parseInt(responses.versionControl || 0),
            problem_solving: parseInt(responses.problemSolving || 0),
            communication_skills: parseInt(responses.communicationSkills || 0),
            blockchain_ecosystems: parseInt(responses.blockchainEcosystems || 0),
            learning_and_growth: parseInt(responses.learningAndGrowth || 0),
            smart_contract_experience: responses.smartContractExperience || '',
            smart_contract_security: responses.smartContractSecurity || '',
            dapp_development_experience: responses.dappDevelopmentExperience || '',
            dapp_development_challenges: responses.dappDevelopmentChallenges || '',
            portfolio: responses.portfolio || '',
            github_contributions: responses.githubContributions || '',
            coding_test: responses.codingTest || ''
        };

        try {
            const response = await axios.post('http://localhost:4000/api/assessment', formData);

            if (response.status === 200 || response.status === 201) {
                const totalScore = calculateTotalScore();
                const tier = determineTier(totalScore);

                toast(`Total Score: ${totalScore} - Tier: ${tier}. Redirecting back to profile...`, {
                    position: "top-center",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: { fontSize: '20px', width: '400px', height: 'auto' },
                });

                setTimeout(() => {
                    router.push('/user/profile');
                }, 10000);
            } else {
                toast.error('Submission was not successful. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    };


    const handleBack = () => {
        router.push('/user/profile');
    };

    if (hasSubmitted) {
        return (
            <div className="max-w-lg mx-auto mt-10">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-800">Assessment Submitted</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Thank you for completing the Blockchain Developer Self-Assessment. Your responses have been recorded.
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => router.push('/user/profile')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">
                            Return to Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Blockchain Developer Self-Assessment</h2>
            {questions.map(question => (
                <div key={question.name}>
                    {question.type === 'checkbox' &&
                        <CheckboxQuestion
                            question={question}
                            onChange={handleChange}
                            checked={responses[question.name] || false}
                        />
                    }
                    {question.type === 'slider' &&
                        <SliderQuestion
                            question={question}
                            onChange={handleChange}
                            value={responses[question.name] || 1}
                        />
                    }
                    {question.type === 'text' &&
                        <div className="mb-4">
                            <label className="block mb-2">{question.label}</label>
                            <input
                                type="text"
                                name={question.name}
                                value={responses[question.name] || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    }
                    {question.type === 'textarea' &&
                        <div className="mb-4">
                            <label className="block mb-2">{question.label}</label>
                            <textarea
                                name={question.name}
                                value={responses[question.name] || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="4"
                            ></textarea>
                        </div>
                    }
                </div>
            ))}
            <div className="flex justify-between mt-4">
                <button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Back
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </div>

        </form>
    );
};

export default function App() {
    return (
        <div className="App max-w-lg mx-auto mt-10">
            <Questionnaire />
            <ToastContainer />
        </div>
    );
}
