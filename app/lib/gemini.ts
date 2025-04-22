import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not defined. Code conversion functionality will not work.');
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Cache for storing previous conversions
type CacheKey = string;
type ConversionCache = {
  [key: CacheKey]: string;
};

// Initialize cache
const conversionCache: ConversionCache = {};

// Generate a cache key from conversion parameters
function generateCacheKey(inputCode: string, inputLanguage: string, outputLanguage: string): CacheKey {
  return `${inputLanguage}_${outputLanguage}_${inputCode}`;
}

export async function convertCodeWithGemini(
  inputCode: string,
  inputLanguage: string,
  outputLanguage: string
): Promise<string> {
  // Generate cache key
  const cacheKey = generateCacheKey(inputCode, inputLanguage, outputLanguage);
  
  // Check if result exists in cache
  if (conversionCache[cacheKey]) {
    console.log('Using cached conversion result');
    return conversionCache[cacheKey];
  }
  
  try {
    const prompt = `Convert the following ${inputLanguage} code to ${outputLanguage}:
    
    \`\`\`${inputLanguage}
    ${inputCode}
    \`\`\`
    
    Return ONLY the converted code without any explanation or additional text.`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract just the code from the response
    let cleanedCode = text;
    if (text.includes('```')) {
      const codeMatch = text.match(/```(?:\w+)?\s*([\s\S]*?)```/);
      cleanedCode = codeMatch ? codeMatch[1].trim() : text;
    }
    
    // Store in cache
    conversionCache[cacheKey] = cleanedCode;
    
    return cleanedCode;
  } catch (error) {
    console.error('Error converting code:', error);
    throw new Error('Failed to convert code. Please check your API key and try again.');
  }
}

// Cache for storing previous explanations
type ExplanationCacheKey = string;
type ExplanationCache = {
  [key: ExplanationCacheKey]: string;
};

// Initialize explanation cache
const explanationCache: ExplanationCache = {};

// Generate a cache key for explanations
function generateExplanationCacheKey(code: string, language: string): ExplanationCacheKey {
  return `${language}_explanation_${code}`;
}

export async function explainCodeWithGemini(
  code: string,
  language: string
): Promise<string> {
  // Generate cache key
  const cacheKey = generateExplanationCacheKey(code, language);
  
  // Check if result exists in cache
  if (explanationCache[cacheKey]) {
    console.log('Using cached explanation result');
    return explanationCache[cacheKey];
  }
  
  try {
    const prompt = `Explain the following ${language} code in detail:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a clear explanation that focuses on:
    1. What the code does
    2. How it works step-by-step
    3. Any key concepts or patterns used
    
    Make the explanation accessible to someone learning this language.`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text().replace(/\**/g, '');
    
    // Store in cache
    explanationCache[cacheKey] = explanation;
    
    return explanation;
  } catch (error) {
    console.error('Error explaining code:', error);
    throw new Error('Failed to explain code. Please check your API key and try again.');
  }
} 