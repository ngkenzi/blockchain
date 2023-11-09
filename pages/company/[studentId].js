import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StudentDetail = () => {
    const router = useRouter();
    const { studentId } = router.query;
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/students-info/${studentId}`);
                setStudent(response.data);
            } catch (error) {
                console.error('Error fetching student details', error);
            }
        };

        if (studentId) {
            fetchStudent();
        }
    }, [studentId]);

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">{student.FirstName} {student.LastName}</h1>
            <p>Email: {student.email}</p>
            <p>Wallet Address: {student.walletAddress}</p>
            {/* Add other student details here */}
        </div>
    );
};

export default StudentDetail;
