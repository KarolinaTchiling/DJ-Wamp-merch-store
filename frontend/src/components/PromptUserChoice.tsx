import React from 'react';
import { createRoot } from 'react-dom/client';

interface PromptUserChoiceProps {
    onChoice: (choice: string) => void;
}

const PromptUserChoice: React.FC<PromptUserChoiceProps> = ({ onChoice }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Choose Cart Merge Option</h2>
                <p className="mb-4">How would you like to handle your cart?</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => onChoice('local')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Use Local Cart
                    </button>
                    <button
                        onClick={() => onChoice('backend')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Use Backend Cart
                    </button>
                    <button
                        onClick={() => onChoice('combine')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Combine Carts
                    </button>
                </div>
            </div>
        </div>
    );
};

const usePromptUserChoice = (): (() => Promise<string>) => {
    const promptUserChoice = (): Promise<string> => {
        return new Promise((resolve) => {
            const rootElement = document.createElement('div');
            document.body.appendChild(rootElement);

            const handleChoice = (choice: string) => {
                resolve(choice);
                root.unmount(); 
                document.body.removeChild(rootElement);
            };

            const root = createRoot(rootElement);
            root.render(<PromptUserChoice onChoice={handleChoice} />);
        });
    };

    return promptUserChoice;
};

export default usePromptUserChoice;
