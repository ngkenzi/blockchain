import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 10;

    useEffect(() => {
        const fetchMembers = async () => {

            try {
                const studentsRes = await axios.get("/api/getStudentsInfo");
                const students = studentsRes.data;

                const submittedStudents = await Promise.all(students.map(async (student) => {
                    const checkRes = await axios.get(`/api/checkSubmissionStatus?walletAddress=${student.walletAddress}`);
                    if (checkRes.data.exists) {
                        // Fetching additional assessment details if needed
                        const assessmentRes = await axios.get(`/api/getAssessmentDetails?walletAddress=${student.walletAddress}`);
                        return { ...student, assessmentDetails: assessmentRes.data };
                    }
                    return null;
                }));

                setMembers(submittedStudents.filter(Boolean));
            } catch (error) {
                console.error('Error fetching members:', error);
                console.log(error.response);

                // if (retryCount < maxRetries) {
                //     setTimeout(() => setRetryCount(retryCount + 1), 3000); // Retry after 3 seconds
                // }
            }
        };

        fetchMembers();
    }, []);

    // Function to open the modal
    const openModal = (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);

    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(member => (
                    <div key={member.id} className="p-4 border rounded">
                        <img src={member.imageURL} alt={`${member.FirstName} ${member.LastName}`} className="w-2/5 rounded-full mb-4" />
                        <h3 className="font-bold text-sm md:text-base">{member.FirstName} {member.LastName}</h3>
                        <p className="text-xs md:text-sm break-words">{member.email}</p>
                        <p className="text-xs md:text-sm">Assessment Score: {member.assessmentDetails?.total_score}</p>
                        <p className="text-xs md:text-sm">Tier: {member.assessmentDetails?.assessment_tier}</p>

                        <button onClick={() => openModal(member)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 text-xs md:text-sm">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
            {selectedMember && (
                <Modal
                    closeModal={closeModal}
                    student={`${selectedMember.FirstName} ${selectedMember.LastName}`}
                    studentId={selectedMember.id}
                    date={new Date(selectedMember.assessmentDetails?.submission_time).toLocaleString()}
                    tier={selectedMember.assessmentDetails?.assessment_tier}
                    walletAddress={selectedMember.walletAddress}
                />
            )}
        </div>
    );
};

export default Members;
