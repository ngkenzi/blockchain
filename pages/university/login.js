import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AiOutlineMail } from "react-icons/ai";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from 'next/link';

function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post("/api/login", { email, password });

            if (res.data && res.data.token) {
                setErrorMessage('');  // Clear any error messages
                localStorage.setItem('isAuthenticated', res.data.token);
                localStorage.setItem('wallet_address', res.data.walletAddress);
                localStorage.setItem('university_name', res.data.uniName);

                router.push('/university/university-certs');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status && err.response.data && err.response.data.message) {
                switch (err.response.status) {
                    case 401:
                        // Authentication-related issues
                        setErrorMessage(err.response.data.message);
                        break;
                    case 500:
                        // Internal server issues
                        setErrorMessage("There was an internal server issue. Please try again later.");
                        break;
                    default:
                        // Any other errors
                        setErrorMessage('Error logging in. Please try again later.');
                        break;
                }
            } else {
                // If the error is not from Axios (network issues, CORS, etc.)
                setErrorMessage('Error logging in. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 py-6 flex flex-col justify-center sm:py-12 text-white">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-center space-x-5">
                            <div className="block pl-2 font-semibold text-xl self-center text-gray-700 text-center">
                                <h2 className="leading-relaxed">Login to your account</h2>
                                <p className="text-sm text-gray-500 font-normal leading-relaxed">Enter your credentials to login.</p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex flex-col">
                                    <label className="leading-loose">Email</label>
                                    <div className="relative">
                                        <AiOutlineMail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                        <input type="email" className="px-4 py-2 pl-10 border focus:ring-blue-500 focus:border-blue-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="leading-loose">Password</label>
                                    <div className="relative">
                                        <FiLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                        <input type={isPasswordVisible ? "text" : "password"} className="px-4 py-2 pl-10 pr-10 border focus:ring-blue-500 focus:border-blue-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        <button type="button" onClick={() => setPasswordVisibility(!isPasswordVisible)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                                            {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <input type="submit" className="flex items-center justify-center w-full px-4 py-3 rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none" value={isLoading ? "Loading..." : "Log In"} disabled={isLoading} />
                                </div>
                            </form>
                            {errorMessage && <p className="text-red-600 text-center mt-2">{errorMessage}</p>}
                        </div>
                        <div className="text-center pt-3">
                            <p className="text-gray-600">Don't have an account?
                                <Link href="/university/register" className="text-blue-600 underline ml-2">Sign up here</Link>
                            </p>
                            <p className="text-gray-600 mt-2">
                                <Link href="/" className="text-blue-600 underline">Navigate back to home</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default login;
