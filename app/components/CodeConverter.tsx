"use client";

import { useState } from 'react';
import { convertCodeWithGemini } from '../lib/gemini';

export default function CodeConverter() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [inputLanguage, setInputLanguage] = useState('JavaScript');
    const [outputLanguage, setOutputLanguage] = useState('Python');
    const [isConverting, setIsConverting] = useState(false);
    
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Go', 'Ruby', 'C#', 'Swift'];
    
    async function convertCode() {
        if (!inputCode.trim()) return;
        
        setIsConverting(true);
        
        try {
            const convertedCode = await convertCodeWithGemini(
                inputCode,
                inputLanguage,
                outputLanguage
            );
            setOutputCode(convertedCode);
        } catch (error) {
            console.error('Error converting code:', error);
            setOutputCode('An error occurred during code conversion. Please try again.');
        } finally {
            setIsConverting(false);
        }
    }
    
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Code Converter</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Column */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between mb-2">
                        <h2 className="text-lg font-semibold">Input</h2>
                        <select 
                            value={inputLanguage}
                            onChange={(e) => setInputLanguage(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Select input programming language"
                        >
                            {languages.map(lang => (
                                <option key={`input-${lang}`} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        className="w-full h-80 p-3 border rounded font-mono text-sm bg-white"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder={`Enter your ${inputLanguage} code here...`}
                    />
                </div>
                
                {/* Output Column */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between mb-2">
                        <h2 className="text-lg font-semibold">Output</h2>
                        <select 
                            value={outputLanguage}
                            onChange={(e) => setOutputLanguage(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Select output programming language"
                        >
                            {languages.map(lang => (
                                <option key={`output-${lang}`} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        className="w-full h-80 p-3 border rounded font-mono text-sm bg-white"
                        value={outputCode}
                        readOnly
                        placeholder={`Converted ${outputLanguage} code will appear here...`}
                    />
                </div>
            </div>
            
            <div className="flex justify-center mt-4">
                <button
                    onClick={convertCode}
                    disabled={isConverting || !inputCode.trim()}
                    className={`px-4 py-2 rounded font-semibold ${
                        isConverting || !inputCode.trim() 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isConverting ? 'Converting...' : 'Convert Code'}
                </button>
            </div>
        </div>
    );
} 