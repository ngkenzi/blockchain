import React, { useState, useEffect } from 'react';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { useRouter } from "next/router";

function AvatarPage() {
    const [walletAddress, setWalletAddress] = useState("");
    const router = useRouter();

    const [attributes, setAttributes] = useState({
        sex: 'woman',
        faceColor: '#F9C9B6',
        earSize: 'big',
        eyeStyle: 'smile',
        noseStyle: 'long',
        mouthStyle: 'smile',
        shirtStyle: 'hoody',
        glassesStyle: 'round',
        hairColor: '#F43150',
        hairStyle: 'thick',
        hatStyle: 'none',
        hatColor: '#fff',
        eyeBrowStyle: 'up',
        shirtColor: '#77311D',
        bgColor: '#FFEBA4',
        shape: 'circle' // Added shape attribute

    });

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("token");
        setWalletAddress(localStorage.getItem("walletAddress"));

        if (!isAuthenticated) {
            router.prefetch("/Ulogin");
            router.push("/Ulogin");
            return;
        }
    }, [router]);

    console.log(walletAddress)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAttributes((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const node = document.getElementById('myAvatar');

        domtoimage.toBlob(node)
            .then(async (blob) => {
                const formData = new FormData();
                formData.append('myAvatar', blob);
                const response = await fetch('api/upload-avatar', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                console.log(result.fileUrl);  // Log the file URL

                // Update the imageURL in the users table with the file URL
                if (walletAddress) {
                    const updateResponse = await fetch('api/update-avatar-url', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            walletAddress,
                            fileUrl: result.fileUrl,
                        }),
                    });
                    if (updateResponse.ok) {
                        console.log('Avatar URL updated successfully');
                        router.push('/user');
                    } else {
                        console.error('Failed to update avatar URL');
                    }
                }
            });
    };

    useEffect(() => {
        // Identify the specific SVG element(s) for the hair - this is a placeholder, replace with the actual selector
        const hairElement = document.querySelector('svg .hair');

        if (hairElement) {
            // Set the fill color to black
            hairElement.style.fill = '#000000';
        }
    }, []);

    const handleCancel = () => {
        // Redirect the user to the user page when the cancel button is clicked
        router.push('/user');
    };

    const config = genConfig(attributes);

    return (
        <div className="App flex flex-col min-h-screen bg-gray-100">
            <main className="flex-1 flex flex-row items-center justify-center p-4">
                <div id="myAvatar" className="mr-10 mb-10 flex-none">
                    <NiceAvatar
                        className="w-64 h-64"
                        hairColorRandom
                        {...config}
                    />
                </div>

                <div className="avatar-options bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-lg flex-auto">

                    {/* Gender */}
                    {/* <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                        <select
                            name="sex"
                            onChange={handleChange}
                            value={attributes.sex}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="man">Man</option>
                            <option value="woman">Woman</option>
                        </select>
                    </div> */}

                    {/* Shape */}
                    {/* <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Shape</label>
                        <div className="flex space-x-2">
                            <button
                                className={`px-4 py-2 border rounded ${attributes.shape === 'circle' ? 'bg-blue-500 text-white' : ''}`}
                                onClick={() => handleChange({ target: { name: 'shape', value: 'circle' } })}
                            >
                                Circle
                            </button>
                            <button
                                className={`px-4 py-2 border rounded ${attributes.shape === 'rounded' ? 'bg-blue-500 text-white' : ''}`}
                                onClick={() => handleChange({ target: { name: 'shape', value: 'rounded' } })}
                            >
                                Rounded
                            </button>
                            <button
                                className={`px-4 py-2 border rounded ${attributes.shape === 'square' ? 'bg-blue-500 text-white' : ''}`}
                                onClick={() => handleChange({ target: { name: 'shape', value: 'square' } })}
                            >
                                Square
                            </button>
                        </div>
                    </div> */}

                    {/* Face Color */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Face Color</label>
                        <input
                            type="color"
                            name="faceColor"
                            onChange={handleChange}
                            value={attributes.faceColor}
                            className="w-full border rounded"
                        />
                    </div>

                    {/* Ear Size */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ear Size</label>
                        <select
                            name="earSize"
                            onChange={handleChange}
                            value={attributes.earSize}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="big">Big</option>
                            <option value="small">Small</option>
                        </select>
                    </div>

                    {/* Eye Style */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Eye Style</label>
                        <select
                            name="eyeStyle"
                            onChange={handleChange}
                            value={attributes.eyeStyle}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="circle">Circle</option>
                            <option value="oval">Oval</option>
                            <option value="smile">Smile</option>
                        </select>
                    </div>

                    {/* Hair Color */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hair Color</label>
                        <input
                            type="color"
                            name="hairColor"
                            onChange={handleChange}
                            value={attributes.hairColor}
                            className="w-full border rounded"
                        />
                    </div>

                    {/* Hair Style */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hair Style</label>
                        <select
                            name="hairStyle"
                            onChange={handleChange}
                            value={attributes.hairStyle}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="normal">Normal</option>
                            <option value="thick">Thick</option>
                            <option value="mohawk">Mohawk</option>
                            <option value="womanLong">Woman Long</option>
                            <option value="womanShort">Woman Short</option>
                        </select>
                    </div>

                    {/* Hat Style */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hat Style</label>
                        <select
                            name="hatStyle"
                            onChange={handleChange}
                            value={attributes.hatStyle}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="none">None</option>
                            <option value="beanie">Beanie</option>
                            <option value="turban">Turban</option>
                        </select>
                    </div>

                    {/* Hat Color */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hat Color</label>
                        <input
                            type="color"
                            name="hatColor"
                            onChange={handleChange}
                            value={attributes.hatColor}
                            className="w-full border rounded"
                        />
                    </div>

                    {/* Eyebrow Style */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Eyebrow Style</label>
                        <select
                            name="eyeBrowStyle"
                            onChange={handleChange}
                            value={attributes.eyeBrowStyle}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="upWoman">Feminine</option>
                            <option value="up">Masculine</option>
                        </select>
                    </div>

                    {/* Shirt Color */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Shirt Color</label>
                        <input
                            type="color"
                            name="shirtColor"
                            onChange={handleChange}
                            value={attributes.shirtColor}
                            className="w-full border rounded"
                        />
                    </div>

                    {/* Background Color */}
                    <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Background Color</label>
                        <input
                            type="color"
                            name="bgColor"
                            onChange={handleChange}
                            value={attributes.bgColor}
                            className="w-full border rounded"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="form-group">
                        <button onClick={handleSave} className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Save
                        </button>
                        <button onClick={handleCancel} className="mt-4 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600">
                            Cancel
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AvatarPage;
