import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import JobDetailsForm from './JobDetailsForm';

const StudentsSearchSection = ({ onSelectStudent }) => {
    const [students, setStudents] = useState([]);
    const [checkedStudents, setCheckedStudents] = useState({});
    const [loading, setLoading] = useState(true);
    const [companyWalletAddress, setCompanyWalletAddress] = useState('');
    const [disabledStudents, setDisabledStudents] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
    const [selectedStudent, setSelectedStudent] = useState(null); // State to hold the selected student for the job offer
    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchCompanyWalletAddress = async () => {
            const companyId = localStorage.getItem('companyId');
            try {
                const response = await axios.get(`http://localhost:4000/company/profile/${companyId}`);
                setCompanyWalletAddress(response.data.wallet_address);
            } catch (error) {
                console.error('Error fetching company wallet address', error);
            }
        };
        fetchCompanyWalletAddress();
    }, []);

    const sendNotification = async (studentWalletAddress, studentId, jobDetails) => {

        const companyId = localStorage.getItem('companyId');
        console.log(companyId)
        
        if (disabledStudents[studentId]) {
            return; // Do not send notification if the student is disabled
        }

        // Fetch company details
        let companyDetails;
        try {
            const companyResponse = await axios.get(`http://localhost:4000/company/profile/${companyId}`);
            companyDetails = companyResponse.data;
        } catch (error) {
            console.error('Error fetching company details', error);
            return; // Exit if company details cannot be fetched
        }

        // Prepare the notification data, including company details
        const notificationData = {
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
            const response = await axios.post('http://localhost:4000/notifications', notificationData);
            if (response.data.success) {
                console.log('Notification sent successfully');
            } else {
                console.warn('Notification could not be sent:', response.data.message);
            }
        } catch (error) {
            console.error('Error sending notification', error);
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:4000/students-info');
                const studentsData = response.data;

                const initialCheckedState = {};
                const initialDisabledState = {};

                // Fetch the notification status for each student
                for (const student of studentsData) {
                    try {
                        const statusResponse = await axios.get(`http://localhost:4000/notifications/status/${student.walletAddress}`);
                        const status = statusResponse.data.status;

                        initialCheckedState[student.id] = status === 'pending' || status === 'accepted';
                        initialDisabledState[student.id] = status === 'pending' || status === 'accepted';
                    } catch (error) {
                        console.error('Error fetching notification status', error);
                        initialCheckedState[student.id] = false;
                        initialDisabledState[student.id] = false;
                    }
                }

                setStudents(studentsData);
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

            // Proceed to send the notification
            await sendNotification(selectedStudent.walletAddress, selectedStudent.id, jobDetails);
        }
    };

    useEffect(() => {
        Object.keys(checkedStudents).forEach((studentId) => {
            const student = students.find(s => s.id.toString() === studentId);
            if (student && checkedStudents[studentId]) {
                sendNotification(student.walletAddress, studentId);
            }
        });
    }, [checkedStudents]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Students</h1>
            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg text-blue-500" />
                </div>
            ) : (
                <div>
                    {students.length > 0 ? (
                        <ul>
                            {students.map((student) => (
                                <li key={student.id} className="mb-4">
                                    <div className="flex items-center">
                                        <div className="flex-1 p-4 border border-gray-300 rounded-md hover:shadow-md transition">
                                            <div className="flex items-center">
                                                <img
                                                    src={student.imageURL || '/sample-profile.png'}
                                                    alt={`${student.FirstName} ${student.LastName}`}
                                                    className="w-20 h-20 rounded-full"
                                                    onError={(e) => {
                                                        e.target.src = "/sample-profile.png";
                                                        e.target.alt = "Default Student Image";
                                                    }}
                                                />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-xl">{`${student.FirstName} ${student.LastName}`}</p>
                                                    <p className=" text-lg">Email: {student.email}</p>
                                                    <p className=" text-lg">Wallet Address: {student.walletAddress}</p>
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