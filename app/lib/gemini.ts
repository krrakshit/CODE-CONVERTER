import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not defined. Code conversion functionality will not work.');
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function convertCodeWithGemini(
  inputCode: string,
  inputLanguage: string,
  outputLanguage: string
): Promise<string> {
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
    
    return cleanedCode;
  } catch (error) {
    console.error('Error converting code:', error);
    throw new Error('Failed to convert code. Please check your API key and try again.');
  }
} 