import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function CreateAssessmentSection() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
    const [submittedQuestions, setSubmittedQuestions] = useState([]);
    const [expiryDate, setExpiryDate] = useState('');

    // Function to check if the assessment has been submitted
    const checkAssessmentSubmission = () => {
        const companyID = localStorage.getItem('companyId');

        fetch(`http://localhost:4000/check-assessment/${companyID}`)
            .then(response => response.json())
            .then(data => {
                if (data.assessmentExists) {
                    setAssessmentSubmitted(true);
                } else {
                    setAssessmentSubmitted(false);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    // Call checkAssessmentSubmission right after submitting the form or on component mount to auto-detect submission
    useEffect(() => {
        checkAssessmentSubmission();
    }, []);

    const fetchSubmittedAssessment = () => {
        const companyID = localStorage.getItem('companyId');
        fetch(`http://localhost:4000/get-assessment/${companyID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.questions) {
                    let questions;
                    try {
                        // Attempt to parse if it's a string, otherwise, use it directly
                        questions = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
                    } catch (error) {
                        console.error('Error parsing questions:', error);
                        questions = []; // Fallback to empty array on error
                    }
                    setSubmittedQuestions(questions);
                }
            })
            .catch(error => console.error('Error fetching assessment:', error));
    };


    const addQuestion = (type) => {
        setQuestions([...questions, { type, content: '', options: type === 'radio' ? ['', ''] : undefined }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, questionIndex) => questionIndex !== index));
    };

    const handleQuestionContentChange = (index, content) => {
        const newQuestions = [...questions];
        newQuestions[index].content = content;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const companyID = localStorage.getItem('companyId');

        if (!expiryDate) {
            alert('Please set an expiry date.');
            return;
        }

        if (!title) {
            alert('Please set a title.');
            return;
        }

        fetch('http://localhost:4000/create-assessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companyID, questions, title, expiryDate })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Success:', data.message);
                    setAssessmentSubmitted(true);
                } else {
                    console.error('Submission Error:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const renderQuestionPreview = (question, index) => {
        switch (question.type) {
            case 'short-text':
            case 'long-text':
                return <input type={question.type === 'short-text' ? 'text' : 'textarea'} placeholder={question.content} className="border p-2 rounded w-full" disabled />;
            case 'radio':
                return question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="block">
                        <input type="radio" name={`question-${index}`} value={option} className="mr-2" disabled />
                        {option}
                    </label>
                ));
            case 'yes-no':
                return (
                    <div>
                        <label className="block">
                            <input type="radio" name={`question-${index}`} value="Yes" className="mr-2" disabled /> Yes
                        </label>
                        <label className="block">
                            <input type="radio" name={`question-${index}`} value="No" className="mr-2" disabled /> No
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            {assessmentSubmitted ? (
                // If an assessment has been submitted, show the "View Assessment" button and submitted questions
                <>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Assessment Submitted</h2>
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            onClick={fetchSubmittedAssessment}
                        >
                            View Assessment
                        </button>
                    </div>
                    {submittedQuestions.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Submitted Questions</h3>
                            <div className="border p-4 rounded-md">
                                {submittedQuestions.map((question, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="font-semibold">{question.content}</p>
                                        {/* Render each question based on its type */}
                                        {renderQuestionPreview(question, index)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Create Assessment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Assessment Title"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                            className="border p-2 rounded w-full mb-4"
                            placeholder="Enter Expiry Date"
                        />

                        {questions.map((question, index) => (
                            <div key={index} className="border p-4 rounded-md flex flex-col">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={question.content}
                                        onChange={(e) => handleQuestionContentChange(index, e.target.value)}
                                        placeholder={`Enter ${question.type} question`}
                                        className="border p-2 rounded w-full mr-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(index)}
                                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 flex items-center"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                {question.type === 'radio' && (
                                    <div className="mt-2 space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <input
                                                key={optionIndex}
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                placeholder="Enter option"
                                                className="border p-2 rounded w-full"
                                            />
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOption(index)}
                                            className="text-sm text-blue-500"
                                        >
                                            Add Option
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="flex space-x-2">
                            <button type="button" onClick={() => addQuestion('short-text')} className="px-4 py-2 border rounded hover:bg-gray-100">Add Short Text Question</button>
                            <button type="button" onClick={() => addQuestion('long-text')} className="px-4 py-2 border rounded hover:bg-gray-100">Add Long Text Question</button>
                            <button type="button" onClick={() => addQuestion('radio')} className="px-4 py-2 border rounded hover:bg-gray-100">Add Radio Button Question</button>
                            <button type="button" onClick={() => addQuestion('yes-no')} className="px-4 py-2 border rounded hover:bg-gray-100">Add Yes/No Question</button>
                        </div>
                        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit Assessment</button>
                    </form>
                    {/* Preview Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">Preview</h3>
                        <div className="border p-4 rounded-md">
                            {questions.length === 0 ? <p>No questions added yet.</p> : questions.map((question, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-semibold">{question.content || `Question ${index + 1}`}</p>
                                    {renderQuestionPreview(question, index)}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}
