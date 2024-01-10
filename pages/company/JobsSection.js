// components/JobsSection.js
import React, { useState } from 'react';
import axios from 'axios';

const JobsSection = () => {
    const [jobDetails, setJobDetails] = useState({
        jobType: '',
        position: '',
        jobDescription: '',
        salary: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const companyId = localStorage.getItem('companyId');
        try {
            const response = await axios.post('http://localhost:4000/jobOffers', { companyId, ...jobDetails });
            setSuccessMessage(response.data.message);
            setJobDetails({
                jobType: '',
                position: '',
                jobDescription: '',
                salary: '',
            });
        } catch (error) {
            console.error('Error creating job offer', error);
            setError('Failed to create job offer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Create Job Offer</h1>
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="jobType" className="block text-gray-700 text-sm font-bold mb-2">Job Type</label>
                    <select name="jobType" value={jobDetails.jobType} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Select a job type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">Position</label>
                    <input type="text" name="position" value={jobDetails.position} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="jobDescription" className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
                    <textarea name="jobDescription" value={jobDetails.jobDescription} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">Salary</label>
                    <input type="text" name="salary" value={jobDetails.salary} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Job Offer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobsSection;
