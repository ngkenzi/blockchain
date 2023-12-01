import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import JobDetailsForm from './JobDetailsForm';
import Link from 'next/link';

const StudentsSearchSection = ({ onSelectStudent }) => {
    const [students, setStudents] = useState([]);
    const [checkedStudents, setCheckedStudents] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Highest');
    const [companyWalletAddress, setCompanyWalletAddress] = useState('');
    const [disabledStudents, setDisabledStudents] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
    const [selectedStudent, setSelectedStudent] = useState(null); // State to hold the selected student for the job offer
    const isFirstRender = useRef(true);
    const [showNotAvailable, setShowNotAvailable] = useState(true);

    useEffect(() => {
        const fetchCompanyWalletAddress = async () => {
            const companyId = localStorage.getItem('companyId');
            try {
                const response = await axios.get('/api/getCompanyProfile', { params: { companyId } });
                setCompanyWalletAddress(response.data.wallet_address);
            } catch (error) {
                console.error('Error fetching company wallet address', error);
            }
        };
        fetchCompanyWalletAddress();
    }, []);

    const sendInvite = async (studentWalletAddress, studentId, jobDetails) => {

        const companyId = localStorage.getItem('companyId');
        console.log(companyId)

        if (disabledStudents[studentId]) {
            return; // Do not send invite if the student is disabled
        }

        // Fetch company details
        let companyDetails;
        try {
            const companyResponse = await axios.get('/api/getCompanyProfile', { params: { companyId } });
            companyDetails = companyResponse.data;
        } catch (error) {
            console.error('Error fetching company details', error);
            return; // Exit if company details cannot be fetched
        }

        // Prepare the invite data, including company details
        const inviteData = {
            recipientWalletAddress: studentWalletAddress,
            senderWalletAddress: companyWalletAddress,
            message: 'You have received a job offer',
            jobType: jobDetails.jobType,
            position: jobDetails.position,
            jobDescription: jobDetails.jobDescription,
            salary: jobDetails.salary,
            // Include additional company details
            companyName: companyDetails.name,
            companyEmail: companyDetails.email,
            companyAddress: companyDetails.address,
            companyPhone: companyDetails.phone,
            companyProfilePicture: companyDetails.profile_picture,
            companyWalletAddress: companyDetails.wallet_address
        };

        try {
            const response = await axios.post('/api/createInvite', inviteData);
            if (response.data.success) {
                console.log('invite sent successfully');
            } else {
                console.warn('invite could not be sent:', response.data.message);
            }
        } catch (error) {
            console.error('Error sending invite', error);
        }
    };
    // Function to handle sorting
    const sortStudents = (a, b) => {
        // Convert scores to numbers, treating "Not Available" as a null value
        const scoreA = a.totalScore !== "Not Available" ? Number(a.totalScore) : null;
        const scoreB = b.totalScore !== "Not Available" ? Number(b.totalScore) : null;

        if (sortOrder === 'Highest') {
            return scoreB - scoreA;
        } else { // sortOrder === 'Lowest'
            return scoreA - scoreB;
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/getStudentsInfo');
                const studentsData = response.data;

                const initialCheckedState = {};
                const initialDisabledState = {};

                // Updated to use Promise.all for efficient asynchronous handling
                const updatedStudents = await Promise.all(studentsData.map(async (student) => {
                    try {
                        const statusResponse = await axios.get(`/api/getInviteStatus?recipientWalletAddress=${student.walletAddress}`);
                        initialCheckedState[student.id] = statusResponse.data.status === 'pending' || statusResponse.data.status === 'Accepted';
                        initialDisabledState[student.id] = statusResponse.data.status === 'pending' || statusResponse.data.status === 'Accepted';
                    } catch (error) {
                        initialCheckedState[student.id] = false;
                        initialDisabledState[student.id] = false;
                    }

                    // Fetching assessment details
                    try {
                        const assessmentRes = await axios.get(`/api/getAssessmentDetails?walletAddress=${student.walletAddress}`);
                        student.assessmentTier = assessmentRes.data.assessment_tier;
                        student.totalScore = assessmentRes.data.total_score;
                    } catch (error) {
                        student.assessmentTier = "Not Available";
                        student.totalScore = "Not Available";
                    }

                    return student;
                }));

                setStudents(updatedStudents);
                setCheckedStudents(initialCheckedState);
                setDisabledStudents(initialDisabledState);
            } catch (error) {
                console.error('Error fetching students', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleCheckClick = (student) => {
        if (disabledStudents[student.id]) {
            // Do not proceed if the student is disabled
            return;
        }

        setSelectedStudent(student);
        setIsFormOpen(true);
    };

    const handleSubmitJobDetails = async (jobDetails) => {
        setIsFormOpen(false); // Close the modal

        if (selectedStudent) {
            // Update the check state for the student
            setCheckedStudents((prev) => ({ ...prev, [selectedStudent.id]: true }));
            setDisabledStudents((prev) => ({ ...prev, [selectedStudent.id]: true }));

            // Proceed to send the invite
            await sendInvite(selectedStudent.walletAddress, selectedStudent.id, jobDetails);
        }
    };

    useEffect(() => {
        Object.keys(checkedStudents).forEach((studentId) => {
            const student = students.find(s => s.id.toString() === studentId);
            if (student && checkedStudents[studentId]) {
                sendInvite(student.walletAddress, studentId);
            }
        });
    }, [checkedStudents]);



    const filteredAndSortedStudents = students
        .filter(student => filter === 'All' || student.assessmentTier === filter)
        .sort(sortStudents)
        .filter(student => showNotAvailable || student.totalScore !== "Not Available");
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Students</h1>

            {/* Filter and Sorting Dropdowns */}
            <div className="mb-4 flex gap-4">
                <select
                    className="block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Novice">Novice</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
                <select
                    className="block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="Highest">Highest Score</option>
                    <option value="Lowest">Lowest Score</option>

                </select>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={showNotAvailable}
                        onChange={(e) => setShowNotAvailable(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">Show Unassessed Users</span>
                </label>
            </div>


            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg text-blue-500" />
                </div>
            ) : (
                <div>
                    {filteredAndSortedStudents.length > 0 ? (
                        <ul>
                            {filteredAndSortedStudents.map((student) => (
                                <li key={student.id} className="mb-4">
                                    <div className="flex items-center " >
                                        <div className="flex-1 p-4 border border-gray-300 rounded-md hover:shadow-md transition">
                                            <div className="flex items-center">
                                                <img
                                                    src={student.imageURL || '/sample-profile.png'}
                                                    alt={`${student.FirstName} ${student.LastName}`}
                                                    className="w-20 h-20 rounded-full cursor-pointer"
                                                    onError={(e) => {
                                                        e.target.src = "/sample-profile.png";
                                                        e.target.alt = "Default Student Image";
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.open(`/students/${student.id}`, '_blank', 'noopener,noreferrer');
                                                    }}
                                                />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-xl">{`${student.FirstName} ${student.LastName}`}</p>
                                                    <p className=" text-lg">Email: {student.email}</p>
                                                    <p className=" text-lg">Wallet Address: {student.walletAddress}</p>
                                                    <p className=" text-lg">Assessment Tier: {student.assessmentTier}</p>
                                                    <p className=" text-lg">Total Score: {student.totalScore}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCheckClick(student)}
                                            className={`ml-4 p-2 border rounded-md transition ${checkedStudents[student.id] ? "border-green-500 text-green-500" : "border-gray-300 text-gray-500"} ${disabledStudents[student.id] || checkedStudents[student.id] ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                            disabled={disabledStudents[student.id] || checkedStudents[student.id]}
                                        >
                                            {checkedStudents[student.id] ? <FaCheckCircle size={24} /> : <FaCircle size={24} />}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex justify-center items-center h-20 text-gray-500">
                            <p>No students found.</p>
                        </div>
                    )}
                </div>
            )}
            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <JobDetailsForm onSubmit={handleSubmitJobDetails} onCancel={() => setIsFormOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsSearchSection;