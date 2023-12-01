import { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        walletAddress: '',
        address: '',
        phone: '',
        profilePicture: null
    });
    const [message, setMessage] = useState('');
    const [previewSource, setPreviewSource] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setFormData({ ...formData, profilePicture: file });
    };

    const handlePhoneChange = (phone) => {
        setFormData({ ...formData, phone });
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        try {
            await axios.post('/api/companyRegister', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Company registered successfully');
        } catch (error) {
            setMessage(error.response.data || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Company Registration</h1>
                {previewSource && (
                    <div className="flex justify-center mb-4">
                        <img src={previewSource} alt="chosen" style={{ height: '100px', width: '100px', borderRadius: '50%' }} />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm">
                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input type="file" id="profilePicture" name="profilePicture" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <PhoneInput
                            country={'my'}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            inputProps={{
                                name: 'phone',
                                id: 'phone'
                            }}
                            inputStyle={{
                                width: '100%',
                                height: '40px',
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Register</button>
                </form>
                {message && <div className="mt-4 p-2 text-center">{message}</div>}

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/company/login">
                            <span className="cursor-pointer font-medium text-blue-500 hover:text-blue-400">
                                Log in
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
