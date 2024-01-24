import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MeetingsSection = () => {
    const [meetings, setMeetings] = useState([]);
    const companyId = localStorage.getItem('companyId');

    useEffect(() => {
        fetchMeetings();
    }, [companyId]);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(`/api/getMeetingsByCompanyID?companyId=${companyId}`);
            setMeetings(response.data.meetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    const updateMeetingStatus = async (meetingId, newStatus) => {
        try {
            await axios.post(`/api/updateMeetingStatus`, { meetingId, status: newStatus });
            fetchMeetings(); // Refetch meetings to update the list
        } catch (error) {
            console.error('Error updating meeting status:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Scheduled Meetings</h2>
            {meetings.map((meeting, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                    <p><strong>Student ID:</strong> {meeting.studentId}</p>
                    <p><strong>Company ID:</strong> {meeting.companyId}</p>
                    <p><strong>Meeting Link:</strong> <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">{meeting.meetingLink}</a></p>
                    <p><strong>Scheduled Time:</strong> {new Date(meeting.scheduledTime).toLocaleString()}</p>
                    <p><strong>Status:</strong> {meeting.status}</p>
                    {meeting.status === 'scheduled' && (
                        <>
                            <button onClick={() => updateMeetingStatus(meeting.id, 'completed')} className="bg-green-500 text-white p-2 rounded mr-2">
                                Set to Completed
                            </button>
                            <button onClick={() => updateMeetingStatus(meeting.id, 'cancelled')} className="bg-red-500 text-white p-2 rounded">
                                Set to Cancelled
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MeetingsSection;
