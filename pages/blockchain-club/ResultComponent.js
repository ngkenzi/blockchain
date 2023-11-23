import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
// import logo from './assets/UPM_Logo.png';

function ResultComponent({ student, studentId, date, tier, onImageGenerate }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);
    const [certificateImageData, setCertificateImageData] = useState(null);

    const generateCertificate = () => {
        setIsGenerating(true);
        setIsCertificateGenerated(false);

        setTimeout(() => {
            const input = document.getElementById('certificate-padding').cloneNode(true);
            input.style.position = 'absolute';
            input.style.left = '-9999px';

            // set the width and height to control the size of the captured area
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
        if (student && studentId && date && tier) {
            generateCertificate();
        }
    }, [student, studentId, date, tier]);

    useEffect(() => {
        if (isCertificateGenerated) {
            onImageGenerate(certificateImageData);
        }
    }, [isCertificateGenerated]);

    const getTierColor = () => {
        switch (tier) {
            case 'Expert': return '#8A2BE2'; // Blue Violet
            case 'Advanced': return '#4169E1'; // Royal Blue
            case 'Intermediate': return '#3CB371'; // Mint Green
            case 'Beginner': return '#7FFFD4'; // Aquamarine
            case 'Novice': return '#FFD700'; // Gold
            default: return '#D4AF37'; // Default color
        }
    };

    const tierColor = getTierColor();

    return (
        <div id="certificate-container" className="p-4 rounded shadow-lg relative overflow-hidden text-center" style={{ backgroundColor: '#FFFDF3', display: 'none' }}>
            <div id="certificate-padding" className="border-4 border-dashed" style={{ borderColor: tierColor, padding: '4px', backgroundColor: '#FFFDF3' }}>
                <div id="certificate" style={{ textAlign: 'center', borderColor: tierColor }}>
                    {/* <img src={logo} alt="Logo" className="w-24 mx-auto mb-4" /> */}
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'black' }}>Certificate of Completion</h1>
                    <p className="text-lg mb-1" style={{ color: 'black' }}>This is to certify that</p>
                    <p className="text-2xl font-bold mb-4" style={{ color: 'black' }}>{student}</p>
                    <p className="text-lg mb-1" style={{ color: 'black' }}>User ID: {studentId}</p>
                    <p className="text-lg mb-1" style={{ color: 'black' }}>Has successfully completed the self-assessment</p>
                    <p className="text-xl font-bold mb-4" style={{ color: 'black' }}>{tier}</p>
                    <p className="text-lg" style={{ color: 'black' }}>Awarded this {date}</p>

                    {/* Badge Element */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: tierColor,
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                    }}>
                        <div style={{ position: 'relative', transform: 'translateY(-30%)' }}>
                            {tier}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ResultComponent;
