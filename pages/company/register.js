import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        walletAddress: '',
        address: '',
        phone: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/companyRegister', formData);
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div>
            <h2>Register Company</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="name" placeholder="Company Name" onChange={handleChange} />
                <input type="text" name="walletAddress" placeholder="Wallet Address (optional)" onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
