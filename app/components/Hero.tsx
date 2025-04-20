import React from "react";
import { BackgroundLines } from "../components/ui/background-lines";
import CodeConverter from "./CodeConverter";

export function Hero() {
  return (
    <div>
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Transform your code <br /> With EASE
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
       Just Paste your code and convert them in a go
      </p>
    </BackgroundLines>
    <div className="container mx-auto py-8">
            <CodeConverter />
        </div>
    </div>
  );
}
