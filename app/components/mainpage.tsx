import CodeConverter from "./CodeConverter";

export default function mainpage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Code Converter</h1>
            <p className="text-center mb-8">Convert your code between different programming languages using Google Gemini AI</p>
            <CodeConverter />
        </div>
    );
}