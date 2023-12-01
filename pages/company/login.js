import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/companyLogin', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('companyId', response.data.companyId);
                router.push('/company/dashboard');
            } else {
                setMessage('Login successful, but no token received');
            }
        } catch (error) {
            setMessage(error.response?.data || 'Something went wrong');
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Company Login</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Login</button>
                </form>
                {message && <div className="mt-4 p-2 text-center">{message}</div>}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/company/register">
                            <span className="cursor-pointer font-medium text-blue-500 hover:text-blue-400">
                                Register
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
