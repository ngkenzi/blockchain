import React, { useState, useEffect } from 'react';

export default function AssessmentsSection() {
    const [assessmentSubmissions, setAssessmentSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        // Fetch assessment submissions data from the API endpoint
        fetch('http://13.250.122.124:5000/assessments-submitted') // Use the correct URL
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAssessmentSubmissions(data.assessmentSubmissions);
                } else {
                    // Handle the case when no assessment submissions are found
                    console.error(data.message);
                }
            })
            .catch((error) => {
                // Handle any network or server error
                console.error('Error fetching assessment submissions:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const viewSubmission = (submissionId) => {
        // Fetch the submission details from the API based on submissionId
        fetch(`http://13.250.122.124:5000/view-assessment-submission/${submissionId}`) // Use the correct URL
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Set the selected submission for viewing, including responses
                    setSelectedSubmission(data.assessmentSubmission);
                } else {
                    // Handle the case when no assessment submission is found
                    console.error(data.message);
                }
            })
            .catch((error) => {
                // Handle any network or server error
                console.error('Error fetching assessment submission details:', error);
            });
    };

    const closeSubmissionModal = () => {
        // Close the modal and clear the selected submission
        setSelectedSubmission(null);
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Assessments Submitted</h2>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <ul>
                    {assessmentSubmissions.map((submission) => (
                        <li key={submission.id} className="border-b-2 border-gray-200 py-2 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold">Submission ID: {submission.id}</p>
                                <p className="text-gray-600">Student ID: {submission.studentId}</p>
                            </div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded"
                                onClick={() => viewSubmission(submission.id)}
                            >
                                View Submission
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Submission Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="bg-white p-4 shadow-md rounded-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">View Submission</h2>
                        <p>Submission ID: {selectedSubmission.id}</p>
                        <p>Student ID: {selectedSubmission.studentId}</p>

                        {/* Display responses */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Responses:</h3>
                            <ul>
                                {Object.entries(JSON.parse(selectedSubmission.responses)).map(([question, answer], index) => (
                                    <li key={index}>
                                        <p>Question {question}: {answer}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Add more details as needed */}
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded mt-4"
                            onClick={closeSubmissionModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
