# Code Converter

A web application that allows you to convert code between different programming languages using Google's Gemini AI.

## Features

- Two-column layout for code input and output
- Support for multiple programming languages
- Real-time code conversion using Google Gemini AI
- Responsive design that works on desktop and mobile

## Supported Languages

- JavaScript
- Python
- Java
- C++
- TypeScript
- PHP
- Go
- Ruby
- C#
- Swift

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/code-converter.git
cd code-converter
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up your Gemini API key
   - Get your API key from [Google Maker Suite](https://makersuite.google.com/app/apikey)
   - Create a `.env.local` file in the root directory
   - Add your API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select the input language from the dropdown
2. Enter or paste your code in the left column
3. Select the output language from the dropdown 
4. Click the "Convert Code" button
5. View the converted code in the right column

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini AI API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
