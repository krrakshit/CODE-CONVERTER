"use client";

import { useState, useEffect } from 'react';
import { convertCodeWithGemini } from '../lib/gemini';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';

// Cache for user input
type InputCache = {
  [key: string]: {
    code: string;
    timestamp: number;
  };
};

// Cache expiration time (7 days in milliseconds)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

export default function CodeConverter() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [inputLanguage, setInputLanguage] = useState('JavaScript');
    const [outputLanguage, setOutputLanguage] = useState('Python');
    const [isConverting, setIsConverting] = useState(false);
    const [inputCache, setInputCache] = useState<InputCache>({});
    
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Go', 'Ruby', 'C#', 'Swift'];
    
    // Check if input and output languages are the same
    const areSameLanguages = inputLanguage === outputLanguage;
    
    // Load saved preferences and cache from localStorage
    useEffect(() => {
        // Load language preferences
        const savedInputLang = localStorage.getItem('inputLanguage');
        const savedOutputLang = localStorage.getItem('outputLanguage');
        
        if (savedInputLang) setInputLanguage(savedInputLang);
        if (savedOutputLang) setOutputLanguage(savedOutputLang);
        
        // Load input code cache
        const savedCache = localStorage.getItem('codeInputCache');
        if (savedCache) {
            try {
                const parsedCache = JSON.parse(savedCache) as InputCache;
                
                // Clean expired cache entries
                const now = Date.now();
                const cleanedCache: InputCache = {};
                
                Object.keys(parsedCache).forEach(key => {
                    if (now - parsedCache[key].timestamp < CACHE_EXPIRATION) {
                        cleanedCache[key] = parsedCache[key];
                    }
                });
                
                setInputCache(cleanedCache);
                
                // Restore last input if available for the selected language
                if (savedInputLang && cleanedCache[savedInputLang]) {
                    setInputCode(cleanedCache[savedInputLang].code);
                }
            } catch (error) {
                console.error('Error parsing cache:', error);
                localStorage.removeItem('codeInputCache');
            }
        }
    }, []);
    
    // Save language preferences when they change
    useEffect(() => {
        localStorage.setItem('inputLanguage', inputLanguage);
        localStorage.setItem('outputLanguage', outputLanguage);
    }, [inputLanguage, outputLanguage]);
    
    // Update cache when input code changes
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setInputCode(newCode);
        
        // Only cache non-empty input
        if (newCode.trim()) {
            const updatedCache = {
                ...inputCache,
                [inputLanguage]: {
                    code: newCode,
                    timestamp: Date.now()
                }
            };
            
            setInputCache(updatedCache);
            localStorage.setItem('codeInputCache', JSON.stringify(updatedCache));
        }
    };
    
    // Handle language change and load cached input if available
    const handleInputLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setInputLanguage(newLang);
        
        // Load cached input for the selected language if available
        if (inputCache[newLang]) {
            setInputCode(inputCache[newLang].code);
        }
    };
    
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
                            onChange={handleInputLangChange}
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
                        onChange={handleInputChange}
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