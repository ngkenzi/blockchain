import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaUserCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

const ProfileSection = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        profile_picture: '',
    });
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const backendBaseURL = "http://13.250.122.124";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const companyId = localStorage.getItem('companyId');
                const response = await axios.get('/api/getCompanyProfile', { params: { companyId } });

                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile', error);
                setMessage('Failed to fetch profile. Please try again.');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const companyId = localStorage.getItem('companyId');
            await axios.put('/api/updateCompanyProfile', profile, {
                params: { companyId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Profile updated successfully');
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile', error);
            setMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Company Profile</h1>
                {editing ? (
                    <div>
                        <button onClick={handleUpdateProfile} className="bg-blue-500 text-white p-2 rounded-md flex items-center transition duration-300 transform hover:scale-105">
                            <FaSave className="mr-2" /> Save Changes
                        </button>
                        <button onClick={() => setEditing(false)} className="bg-red-500 text-white p-2 rounded-md flex items-center ml-2 transition duration-300 transform hover:scale-105">
                            <MdCancel className="mr-2" /> Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="bg-gray-500 text-white p-2 rounded-md flex items-center transition duration-300 transform hover:scale-105">
                        <FaEdit className="mr-2" /> Edit Profile
                    </button>
                )}
            </div>
            {profile.profile_picture && (
                <div className="flex justify-center mb-6">
                    <img
                        src={`${profile.profile_picture}`}
                        alt={`${profile.name}'s profile`}
                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                        onError={(e) => {
                            e.target.src = "default-image-url.jpg"; // replace with your default image URL
                            e.target.alt = "Default Profile";
                        }}
                    />
                </div>
            )}

            {Object.entries(profile).map(([key, value]) => (
                key !== 'profile_picture' && (
                    <div className="mb-4" key={key}>
                        <label className="text-gray-600 capitalize block mb-2">{key}:</label>
                        {editing ? (
                            <input type="text" value={value} name={key} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md transition duration-300" />
                        ) : (
                            <span className="ml-2 text-gray-700">{value}</span>
                        )}
                    </div>
                )
            ))}
            {message && <div className="mt-4 p-2 text-center text-red-500">{message}</div>}
        </div>
    );
};

export default ProfileSection;
