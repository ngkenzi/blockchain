import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AiOutlineMail, AiOutlineBook } from "react-icons/ai";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from 'next/link';

function register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityName, setUniversityName] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/register", {
                email,
                password,
                universityName,
            });

            if (res.status === 201) {
                localStorage.setItem('isAuthenticated', 'true');
                router.push('/university/university-certs');
            }

        } catch (err) {
            console.error(err);
            alert('Error registering user');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 py-6 flex flex-col justify-center sm:py-12 text-white">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-center space-x-5">
                            <div className="block pl-2 font-semibold text-xl self-center text-gray-700 text-center">
                                <h2 className="leading-relaxed">Register Your University</h2>
                                <p className="text-sm text-gray-500 font-normal leading-relaxed">Join our network of universities and start issuing NFT-based certificates today</p>
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
                                <div className="flex flex-col">
                                    <label className="leading-loose">University Name</label>
                                    <div className="relative">
                                        <AiOutlineBook className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                        <input type="text" className="px-4 py-2 pl-10 border focus:ring-blue-500 focus:border-blue-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="University Name" value={universityName} onChange={(e) => setUniversityName(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <input type="submit" className="flex items-center justify-center w-full px-4 py-3 rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none" value="Create Account" />
                                </div>
                            </form>
                        </div>
                        <div className="text-center pt-3">
                            <p className="text-gray-600">Already registered your university?
                                <Link href="/university/login" className="text-blue-600 underline ml-2">Login here</Link>
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

export default register;
