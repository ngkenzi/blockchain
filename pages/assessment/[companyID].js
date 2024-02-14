import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AssessmentPage = () => {
    const router = useRouter();
    const { companyID } = router.query;
    const [assessment, setAssessment] = useState([]);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState("");
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("token");
        setWalletAddress(localStorage.getItem("walletAddress"));

        if (!isAuthenticated) {
            router.prefetch("/user/login");
            router.push("/user/login");
            return;
        }
    }, [router]);

    const fetchStudentInfo = async () => {
        if (walletAddress) {
            try {
                const response = await axios.get(
                    `/api/getStudentInfoByWalletAddress?walletAddress=${walletAddress}`
                );
                const studentData = response.data;
                setStudentId(studentData.id);
                console.log(studentId)

            } catch (error) {
                console.error("Error fetching student info:", error);
            }
        }
    };

    useEffect(() => {
        fetchStudentInfo();
    }, [walletAddress]); // Add walletAddress as a dependency


    useEffect(() => {
        if (companyID) {
            setLoading(true);
            axios.get(`http://localhost:4000/get-assessment/${companyID}`)
                .then(response => {
                    if (response.data.success) {
                        setAssessment(response.data.questions);
                        const initialResponses = response.data.questions.reduce((acc, _, index) => ({
                            ...acc,
                            [index]: ''
                        }), {});
                        setResponses(initialResponses);
                    } else {
                        alert('Failed to fetch assessment');
                    }
                })
                .catch(error => console.error('Error fetching assessment:', error))
                .finally(() => setLoading(false));
        }
    }, [companyID]);

    const handleChange = (questionIndex, value) => {
        setResponses({
            ...responses,
            [questionIndex]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(studentId)
        // Assuming you have studentId and companyID available, and responses collected in state
        try {
            const response = await axios.post('http://localhost:4000/submit-assessment', {
                studentId,
                companyID,
                responses
            });

            if (response.data.success) {
                alert('Assessment submitted successfully!');
                router.push('/user/profile');

            } else {
                console.error('Failed to submit assessment:', response.data.message);
                alert('Failed to submit assessment. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('An error occurred while submitting the assessment.');
        }
    };


    if (loading) {
        return <p>Loading assessment...</p>;
    }

    if (!assessment.length) {
        return <p>No assessment found.</p>;
    }

    return (
        <div className="p-5">
            <h1 className="text-xl font-semibold mb-4">Assessment for Company ID: {companyID}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {assessment.map((question, index) => (
                    <div key={index} className="mb-4">
                        <p className="font-medium">{question.content}</p>
                        {question.type === 'short-text' && (
                            <input
                                type="text"
                                placeholder="Your answer"
                                value={responses[index] || ''}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="mt-2 p-2 border rounded w-full"
                            />
                        )}
                        {question.type === 'long-text' && (
                            <textarea
                                placeholder="Your answer"
                                value={responses[index] || ''}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="mt-2 p-2 border rounded w-full"
                                rows="3"
                            />
                        )}
                        {['radio', 'yes-no'].includes(question.type) && question.options && question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="inline-flex items-center mt-2">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="form-radio h-5 w-5 text-blue-600"
                                /><span className="ml-2 text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                ))}

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit Assessment</button>
            </form>
        </div>
    );
};

export default AssessmentPage;
