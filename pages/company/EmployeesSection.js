import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const EmployeesSection = () => {
    const [companyWalletAddress, setCompanyWalletAddress] = useState('');
    const [acceptedStudents, setAcceptedStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanyWalletAddress = async () => {
            const companyId = localStorage.getItem('companyId');
            setIsLoading(true);
            try {
                const response = await axios.get('/api/getCompanyProfile', { params: { companyId } });
                setCompanyWalletAddress(response.data.wallet_address);
            } catch (error) {
                console.error('Error fetching company wallet address', error);
                setError('Failed to fetch company details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyWalletAddress();
    }, []);

    useEffect(() => {
        if (!companyWalletAddress) return;

        const fetchAcceptedStudents = async () => {
            setIsLoading(true);
            try {
                // Assuming your API requires the company wallet address to fetch the accepted students
                const response = await axios.get('/api/getAcceptedStudents', {
                    params: { companyWalletAddress }
                });
                setAcceptedStudents(response.data);
            } catch (error) {
                console.error('Error fetching accepted students', error);
                setError('Failed to fetch accepted students. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAcceptedStudents();
    }, [companyWalletAddress]);

    const handleCopyToClipboard = useCallback(async (walletAddress) => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            alert('Address copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Employees</h1>
            {acceptedStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {acceptedStudents.map((student) => (
                        <div key={student.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                            <div className="p-6">
                                <div className="flex justify-center">
                                    <img src={student.imageURL} alt={`${student.FirstName} ${student.LastName}`} className="w-24 h-24 rounded-full object-cover border-4 border-blue-400" />
                                </div>
                                <h3 className="mt-4 text-lg text-center font-semibold text-blue-600">{`${student.FirstName} ${student.LastName}`}</h3>
                                <p className="text-sm text-center text-gray-500">{student.email}</p>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="text-center text-gray-700">
                                        <p><span className="font-medium">Job Type:</span> {student.job_type}</p>
                                        <p><span className="font-medium">Position:</span> {student.position}</p>
                                        <p><span className="font-medium">Monthly Salary:</span> {student.salary ? `MYR ${student.salary}` : 'Not disclosed'}</p>
                                        <p><span className="font-medium">Wallet Address:</span>
                                            <button
                                                onClick={() => handleCopyToClipboard(student.walletAddress)}
                                                className="ml-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                {shortenAddress(student.walletAddress)}
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-800">No employees found.</div>
            )}
        </div>
    );


};

export default EmployeesSection;