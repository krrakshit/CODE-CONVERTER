"use client";

import { useState } from 'react';
import { convertCodeWithGemini } from '../lib/gemini';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';

export default function CodeConverter() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [inputLanguage, setInputLanguage] = useState('JavaScript');
    const [outputLanguage, setOutputLanguage] = useState('Python');
    const [isConverting, setIsConverting] = useState(false);
    
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Go', 'Ruby', 'C#', 'Swift'];
    
    // Check if input and output languages are the same
    const areSameLanguages = inputLanguage === outputLanguage;
    
    async function convertCode() {
        if (!inputCode.trim()) return;
        
        // If languages are the same, copy input to output without API call
        if (areSameLanguages) {
            setOutputCode(inputCode);
            return;
        }
        
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
        <div className="space-y-6">            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Column */}
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex justify-between mb-3 items-center">
                        <h2 className="text-lg font-semibold">Input</h2>
                        <Select 
                            value={inputLanguage}
                            onChange={(e) => setInputLanguage(e.target.value)}
                            aria-label="Select input programming language"
                            className="w-40"
                        >
                            {languages.map(lang => (
                                <option key={`input-${lang}`} value={lang}>{lang}</option>
                            ))}
                        </Select>
                    </div>
                    <Textarea
                        className="font-mono min-h-[20rem] resize-none"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder={`Enter your ${inputLanguage} code here...`}
                    />
                </div>
                
                {/* Output Column */}
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex justify-between mb-3 items-center">
                        <h2 className="text-lg font-semibold">Output</h2>
                        <Select 
                            value={outputLanguage}
                            onChange={(e) => setOutputLanguage(e.target.value)}
                            aria-label="Select output programming language"
                            className="w-40"
                        >
                            {languages.map(lang => (
                                <option key={`output-${lang}`} value={lang}>{lang}</option>
                            ))}
                        </Select>
                    </div>
                    {areSameLanguages && inputCode.trim() && (
                        <div className="mb-2 px-2 py-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-sm rounded-md">
                            Input and output languages are the same. No conversion needed.
                        </div>
                    )}
                    <Textarea
                        className="font-mono min-h-[20rem] resize-none bg-muted/50"
                        value={outputCode}
                        readOnly
                        placeholder={`Converted ${outputLanguage} code will appear here...`}
                    />
                </div>
            </div>
            
            <div className="flex justify-center">
                <Button
                    onClick={convertCode}
                    disabled={isConverting || !inputCode.trim()}
                    variant={isConverting ? "secondary" : "default"}
                    size="lg"
                    className="w-full max-w-xs"
                >
                    {areSameLanguages ? 'Copy Code' : (isConverting ? 'Converting...' : 'Convert Code')}
                </Button>
            </div>
        </div>
    );
} 