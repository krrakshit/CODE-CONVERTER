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