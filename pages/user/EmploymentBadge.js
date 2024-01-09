import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
// import logo from './assets/UPM_Logo.png';

function EmploymentBadge({ student, studentId, date, company, onImageGenerate }) {
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
                console.log("EmploymentBadge generating image", imgData);

                setIsGenerating(false);
                setIsCertificateGenerated(true);
                document.body.removeChild(input);
            });
        }, 200);
    };

    useEffect(() => {
        console.log("EmploymentBadge props", { student, studentId, date, company });

        if (student && studentId && date && company) {
            generateCertificate();
        }
    }, [student, studentId, date, company]);

    useEffect(() => {
        if (isCertificateGenerated) {
            onImageGenerate(certificateImageData);
        }
    }, [isCertificateGenerated]);

    return (
        <div id="certificate-container" className="p-2 rounded shadow-lg relative overflow-hidden text-center" style={{ backgroundColor: '#001741', borderStyle: 'solid', borderWidth: '15px', borderImage: 'linear-gradient(45deg, rgb(1,65,188), rgb(63,229,245)) 1' }}>
            <div id="certificate-padding" className="" style={{ borderWidth: '3px', borderImage: 'linear-gradient(45deg, rgb(1,65,188), rgb(63,229,245)) 1', padding: '6px', backgroundColor: '#001741' }}>
                <div id="certificate-padding2" className="border-2" style={{ borderImage: 'linear-gradient(15deg, rgb(1,65,188), rgb(255,0,226)) 1', padding: '4px', backgroundColor: '#001741' }}>
                    <div id="certificate-padding3" className="border-l border-r border-dashed" style={{ borderColor: '#FF00E2', padding: '0px 4px', backgroundColor: '#001741' }}>
                        <div id="certificate-padding4" className="border-t border-b" style={{ borderImage: 'linear-gradient(15deg, rgb(1,65,188), rgb(255,0,226)) 1', padding: '4px', background: '#001741 linear-gradient(hsla(184, 96%, 46%, 0) 90%,hsla(184, 96%, 46%, 0.2) 95%)top left / 100% 0.4rem' }}>
                            <div id="certificate" className="px-10" style={{ textAlign: 'center', fontFamily: 'Tahoma' }}>
                                {/* <img src={logo} alt="Logo" className="w-24 mx-auto mb-4" /> */}
                                <div className="py-1 my-10 mx-auto" style={{ borderTop: '15px solid', borderBottom: '10px solid', maxWidth: '1200px', borderImage: 'linear-gradient(15deg, rgb(166,79,255), rgb(63,229,245)) 1', clipPath: 'polygon(0px 10px, 26px 0px, calc(30% - 25px) 0px, 30% 10px, 100% 10px, 100% calc(100% - 5px), calc(100% - 10px) calc(100% - 5px), calc(70% - 5px) calc(100% - 5px), calc(70% - 10px) calc(100% - 0px), 5px calc(100% - 0px), 0% calc(100% - 5px))' }}>
                                    <div className="border-t border-b" style={{ borderImage: 'linear-gradient(15deg, rgb(166,79,255), rgb(255,255,255)) 1' }}>
                                        <h1 className="my-7 text-2xl font-bold" style={{ color: '#A64FFF', textTransform: 'uppercase' }}>Employment Badge</h1>
                                    </div>
                                </div>
                                <p className="mb-7" style={{ color: 'white' }}>This is to certify that</p>
                                <p className="text-6xl font-bold mb-1" style={{ color: '#A64FFF', textTransform: 'uppercase', textShadow: '2px 0px white' }}>{student}</p>
                                <p className="text-lg mb-7 font-bold" style={{ color: '#A64FFF', textShadow: '1px 0px white' }}>ID: {studentId}</p>
                                <p className="" style={{ color: 'white' }}>Is part of the company</p>
                                <p className="text-xl font-bold mb-4" style={{ color: 'white' }}>{company}</p>
                                <p className="mb-10" style={{ color: 'white' }}>Employed {date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // <div id="certificate-container" className="p-4 rounded shadow-lg relative overflow-hidden text-center" style={{ backgroundColor: '#FFFDF3', display: 'none' }}>
        //     <div id="certificate-padding" className="border-4 border-dashed" style={{ borderColor: '#D4AF37', padding: '4px', backgroundColor: '#FFFDF3' }}>
        //         <div id="certificate" style={{ textAlign: 'center' }}>
        //             {/* <img src={logo} alt="Logo" className="w-24 mx-auto mb-4" /> */}
        //             <h1 className="text-3xl font-bold mb-2" style={{ color: 'black' }}>Certificate of Completion</h1>
        //             <p className="text-lg mb-1" style={{ color: 'black' }}>This is to certify that</p>
        //             <p className="text-2xl font-bold mb-4" style={{ color: 'black' }}>{student}</p>
        //             <p className="text-lg mb-1" style={{ color: 'black' }}>Student ID: {studentId}</p>
        //             <p className="text-lg mb-1" style={{ color: 'black' }}>Is part of the company</p>
        //             <p className="text-xl font-bold mb-4" style={{ color: 'black' }}>{company}</p>
        //             <p className="text-lg" style={{ color: 'black' }}>Awarded this {date}</p>
        //         </div>
        //     </div>
        // </div>

    );

}

export default EmploymentBadge;
