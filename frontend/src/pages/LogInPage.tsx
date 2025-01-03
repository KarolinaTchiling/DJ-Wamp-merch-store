import React, { useState } from 'react';
import Logo from "../components/Misc/Logo.tsx";
import Button from "../components/Misc/Button.tsx";
import Tooltip from "../components/Misc/Tooltip.tsx";
import axios from 'axios';
import { useTokenContext } from "../contexts/TokenContext.tsx";
import { useCartContext } from "../contexts/cart/CartContext.tsx";
import Loader from "../components/Misc/Loader.tsx";
import { useLocation, useNavigate } from "react-router-dom";

const LogInPage: React.FC = () => {
    const { setToken, setUserType } = useTokenContext();
    const { handleCartMergeOnLogin } = useCartContext();

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const navigate = useNavigate();
    const location = useLocation();
    
    const returnToCheckout = (location.state as { returnToCheckout?: boolean })?.returnToCheckout;

    function logIn(event: React.FormEvent) {
        event.preventDefault(); // Prevent form submission default behavior
        setLoading(true); // Set loading to true when login starts

        axios({
            method: "post",
            baseURL: `${import.meta.env.VITE_BASE_URL}`, // Replace with personal port
            url: "/login", // Flask route that handles login auth
            data: {
                email: loginForm.email,
                password: loginForm.password,
            }
        }).then(async (response) => {
            console.log("Log in successful for " + loginForm.email);
            setToken(response.data.token);
            setUserType("user");

            await handleCartMergeOnLogin();

            if (returnToCheckout) {
                navigate("/checkout");
            }


        }).catch((error) => {
            if (error.response) {
                console.error("Error:", error.response);
            }
        }).finally(() => {
            setLoading(false); // Set loading to false after login is complete
        });

        setLoginForm({ email: "", password: "" });
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value, name } = event.target;
        setLoginForm(prevState => ({ ...prevState, [name]: value }));
    }

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-cream bg-opacity-100 flex items-center justify-center z-10 flex-col">
                    <div className="text-coffee text-xl mb-6">Logging In</div>
                    <Loader />
                </div>
            )}

            <form
                className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center"
                onSubmit={logIn}
            >
                <div className="flex justify-center">
                    <Logo size={48} />
                </div>

                <div className="mt-4 w-full flex justify-center items-center space-x-2">
                    <div className="mb-4">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            value={loginForm.email}
                            type="email"
                            onChange={handleChange}
                            placeholder=""
                            autoComplete="on"
                            className="bg-transparent w-full mt-1 py-1 px-2 border border-camel"
                        />
                    </div>
                    <div className="mt-3">
                        <Tooltip title="Don't want to make an account? Use Login: jane.doe@gmail.com"/>  
                    </div> 
                </div>

                <div className="mb-4 w-full flex justify-center items-center space-x-2">
                    <div className="mb-4 w-full">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            value={loginForm.password}
                            type="password"
                            onChange={handleChange}
                            placeholder=""
                            autoComplete="on"
                            className="bg-transparent w-full mt-1 py-1 px-2 border border-camel"
                        />
                    </div>
                    <div className="mt-3">
                        <Tooltip title="Password123!"/>  
                    </div> 
                </div>
                <div className="mb-4 w-full flex justify-center items-center space-x-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Logging In..." : "Log In"}
                    </Button>
                </div>

                <hr className="border-camel mt-10 mb-10" />
                <Button onClick={() => { window.location.href = "#/admin"; }}>
                    To Admin View
                </Button>
                <hr className="border-camel mt-10 mb-10" />
                <div className="grid grid-cols-1 gap-4 place-items-center">
                    <p>Don't have an account? 
                        <a href="#/signup" className="font-normal underline text-camel hover:font-extrabold">
                            Sign Up
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LogInPage;
