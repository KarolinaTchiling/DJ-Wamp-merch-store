import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Button from '../Misc/Button.tsx';
import Loader from "../Misc/Loader.tsx";
import GitIcon from "../../../public/github-mark.svg";

interface WelcomeProp {
    onAcknowledge: () => void; // Callback when the user acknowledges the message
}

const WelcomeDialog: React.FC<WelcomeProp> = ({ onAcknowledge }) => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Connecting to the server...Can take up to 1 minute.');

    useEffect(() => {
        const simulateFetch = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/`);
                if (response.ok) {
                    setMessage('Connection successful! You can now explore the store.');
                } else {
                    setMessage('Connection failed. Please try again later.');
                }
            } catch (error) {
                setMessage('Connection failed. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        simulateFetch();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-coffee bg-opacity-20 z-50 border border-camel">
            <div className="bg-cream w-[650px] p-6 shadow-lg border border-camel text-center">
                <h2 className="text-2xl font-semibold mb-4">Welcome to DJ Wamp's Merch Store!</h2>
                <p className="text-lg">This is an e-commerce store I built using a tech-stack of <strong>React–Flask–MongoDB–Render–Vercel!</strong> Notable features include:</p>
                <ul className="text-left list-disc px-8 pt-2">
                    <li><strong>Dynamic Catalog: </strong>A fully responsive front end that displays a catalog of products with category-based filtering.</li>
                    <li><strong>Interactive Features: </strong>Users can browse products, view details, add items to the cart, create an account and proceed through a checkout process.</li>
                    <li><strong>Admin Panel: </strong>A secure admin dashboard for managing inventory, orders, and user accounts.</li>
                    <li><strong>Backend API: </strong>Flask API integrated with a MongoDB database hosted on Atlas for managing product, order and user data.</li>
                    <li><strong>Deployment: </strong>Deployed using Render for the backend and Vercel for the frontend, utilizing free-tier deployment features.</li>
                </ul>
                <div className="justify-self-center flex flex-row items-center mt-4">
                    <a href="https://github.com/KarolinaTchiling/DJ-Wamp-merch-store" target="_blank" rel="noopener noreferrer">
                        <img src={GitIcon} alt="GitHub" className="w-8 h-8 mx-auto mr-2" />
                    </a>
                    <p>Checkout the repo</p>
                </div>
                <p className="text-lg my-4">{message}</p>
                
                {loading ? (
                    <div className="flex items-center justify-self-center mt-4">
                        <Loader />
                    </div>
                ) : (
                    <Button
                        className="px-10 mt-4 flex items-center justify-self-center transition-colors duration-300"
                        onClick={onAcknowledge}
                    >
                        OK
                    </Button>
                )}
            </div>
        </div>
    );
};

export const useWelcomeDialog = (): (() => Promise<void>) => {
    const showWelcomeDialog = (): Promise<void> => {
        return new Promise((resolve) => {
            const rootElement = document.createElement('div');
            document.body.appendChild(rootElement);

            const handleAcknowledge = () => {
                resolve();
                root.unmount();
                document.body.removeChild(rootElement);
            };

            const root = createRoot(rootElement);
            root.render(<WelcomeDialog onAcknowledge={handleAcknowledge} />);
        });
    };

    return showWelcomeDialog;
};

export default WelcomeDialog;

