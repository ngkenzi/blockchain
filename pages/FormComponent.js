import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingOutlined } from "@ant-design/icons";

function FormComponent({ onSubmit, template }) {
    const [student, setStudent] = useState("");
    const [date, setDate] = useState("");
    const [course, setCourse] = useState("");
    const [studentId, setStudentId] = useState("");

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [studentIdError, setStudentIdError] = useState("");
    const isValid = student.trim() !== '' && date.trim() !== '' && course.trim() !== '' && studentId.trim() !== '' && !error && studentIdError === '';
    const [students, setStudents] = useState([]);

    const handleChange = (e, setter) => {
        setter(e.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        let exists = false;

        if (template !== "Course") {
            exists = await checkStudentIdExists(studentId);
        }
        if (student.trim() === '' || date.trim() === '' || course.trim() === '' || studentId.trim() === '') {
            setError(true);
            setIsLoading(false); // Stop loading
        } else if (exists) {
            setStudentIdError('Student ID already exists. Please use a different ID.');
        } else {
            setError(false);
            setStudentIdError('');
            onSubmit({ student, date, course, studentId });
            setIsLoading(false); // Stop loading
        }
    };


    const checkStudentIdExists = async (id) => {
        try {
            const response = await axios.get(`/api/checkStudentId?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error checking studentId:", error);
            return false;
        }
    };

    const handleStudentChange = (e) => {
        const selectedId = e.target.value;
        const selectedStudent = students.find(student => student.id.toString() === selectedId);
        if (selectedStudent) {
            setStudentId(selectedId);
            setStudent(selectedStudent.email);  
        }
    };


    useEffect(() => {
        if (studentId.trim() !== '' && template !== "Course") {
            const fetchStudentId = async () => {
                const exists = await checkStudentIdExists(studentId);
                if (exists) {
                    setStudentIdError('Student ID already exists. Please use a different ID.');
                } else {
                    setStudentIdError('');
                }
            };

            fetchStudentId();
        } else {
            setStudentIdError('');
        }
    }, [studentId, template]); // Trigger only when studentId or template changes


    useEffect(() => {
        const fetchStudents = async () => {
            const universityName = localStorage.getItem('university_name');
            if (!universityName) {
                console.error("University name not found in local storage");
                return;
            }

            try {
                const response = await axios.get(`/api/students?universityName=${universityName}`);
                console.log(response.data);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="flex justify-center mt-6">

            <form onSubmit={handleSubmit} className="w-1/2 mx-auto m-4">
                {error && <div className="text-red-500 mb-2">All fields are required</div>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Student Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={student}
                        onChange={e => handleChange(e, setStudent)}
                        placeholder="Enter student's name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="date"
                        value={date}
                        onChange={e => handleChange(e, setDate)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Course
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={course}
                        onChange={e => handleChange(e, setCourse)}
                        placeholder="Enter course name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select Student
                    </label>
                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={studentId}
                        onChange={handleStudentChange}>
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>{student.id}</option>  // Changed to student.id
                        ))}
                    </select>
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit"
                        disabled={!isValid || isLoading}
                        className={`py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded ${isValid ? '' : 'opacity-50 cursor-not-allowed'}`}>
                        {isLoading ? <LoadingOutlined spin /> : "Generate Certificate"}
                    </button>
                </div>

                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select Student
                    </label>
                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={student}
                        onChange={e => handleChange(e, setStudent)}>
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.email}>{student.email}</option>
                        ))}
                    </select>
                </div> */}


            </form>
        </div>

    );
}

export default FormComponent;
