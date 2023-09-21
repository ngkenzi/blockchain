import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

function CourseComponent({ student, studentId, date, course, onImageGenerate }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);
    const [certificateImageData, setCertificateImageData] = useState(null);

    const generateCertificate = () => {
        setIsGenerating(true);
        setIsCertificateGenerated(false);

        setTimeout(() => {
            const input = document.getElementById('course-padding').cloneNode(true);
            input.style.position = 'absolute';
            input.style.left = '-9999px';

            // Modify width and height to control the size of the captured area if needed
            input.style.width = '900px';
            input.style.height = '500px';
            input.style.transform = 'scale(1.3)';

            // Add the following styles to center the content vertically
            input.style.display = 'flex';
            input.style.flexDirection = 'column';
            input.style.justifyContent = 'center';

            document.body.appendChild(input);

            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                setCertificateImageData(imgData);

                setIsGenerating(false);
                setIsCertificateGenerated(true);
                document.body.removeChild(input);
            });
        }, 200);
    };

    useEffect(() => {
        if (student && studentId && date && course) {
            generateCertificate();
        }
    }, [student, studentId, date, course]);

    useEffect(() => {
        if (isCertificateGenerated) {
            onImageGenerate(certificateImageData);
        }
    }, [isCertificateGenerated]);

    return (
        <div id="course-container" className="p-4 rounded shadow-lg relative overflow-hidden text-center" style={{ backgroundColor: '#E5E7EB', display: 'none' }}>
            <div id="course-padding" className="border-4 border-solid" style={{ borderColor: '#2563EB', padding: '4px', backgroundColor: '#DBEAFE' }}>
                <div id="course" style={{ textAlign: 'center' }}>
                    {/* If you want to include a different logo: */}
                    {/* <img src={courseLogo} alt="Course Logo" className="w-24 mx-auto mb-4" /> */}
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E3A8A' }}>Course Completion</h1>
                    <p className="text-lg mb-1" style={{ color: '#1E3A8A' }}>Congrats,</p>
                    <p className="text-2xl font-bold mb-4" style={{ color: '#1E3A8A' }}>{student}</p>
                    <p className="text-lg mb-1" style={{ color: '#1E3A8A' }}>Student ID: {studentId}</p>
                    <p className="text-lg mb-1" style={{ color: '#1E3A8A' }}>For completing the course:</p>
                    <p className="text-xl font-bold mb-4" style={{ color: '#1E3A8A' }}>{course}</p>
                    <p className="text-lg" style={{ color: '#1E3A8A' }}>Awarded on {date}</p>
                </div>
            </div>
        </div>
    );

}

export default CourseComponent;
