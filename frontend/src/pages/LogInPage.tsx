import React, { useState } from 'react';
import Logo from "../components/Misc/Logo.tsx";
import Button from "../components/Misc/Button.tsx";
import Tooltip from "../components/Misc/Tooltip.tsx";
import Loader from "../components/Misc/Loader.tsx";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../components/Misc/Input.tsx";
import { email_validation, pw_validation } from "../components/Misc/InputValidations.tsx";
import axios from 'axios';
import { useTokenContext } from "../contexts/TokenContext.tsx";
import { useCartContext } from "../contexts/cart/CartContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";

const LogInPage: React.FC = () => {
    const { setToken, setUserType } = useTokenContext();
    const { handleCartMergeOnLogin } = useCartContext();
    const navigate = useNavigate();
    const location = useLocation();

    const returnToCheckout = (location.state as { returnToCheckout?: boolean })?.returnToCheckout;
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false);

    const methods = useForm();

    const logIn = methods.handleSubmit(() => {
        setLoading(true);

        axios({
            method: "post",
            baseURL: `${import.meta.env.VITE_BASE_URL}`,
            url: "/login",
            data: {
                email: loginForm.email.trim(),
                password: loginForm.password.trim(),
            },
        })
            .then(async (response) => {
                console.log("Log in successful for " + loginForm.email);
                setToken(response.data.token);
                setUserType("user");
                await handleCartMergeOnLogin();

                if (returnToCheckout) {
                    navigate("/checkout");
                } else {
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Error during login:", error.response || error.message);
            })
            .finally(() => {
                setLoading(false);
            });

        setLoginForm({ email: "", password: "" });
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value, name } = event.target;
        setLoginForm((prevState) => ({ ...prevState, [name]: value }));
        methods.trigger(name);
    }

    return (
        <div className="relative min-w-full flex-grow">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-cream bg-opacity-100 flex items-center justify-center z-10 flex-col">
                    <div className="text-coffee text-xl mb-6">Logging In...</div>
                    <Loader />
                </div>
            )}

            <FormProvider {...methods}>
                <form
                    noValidate
                    onSubmit={(e) => e.preventDefault()}
                    className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center"
                >
                    <div className="flex justify-center">
                        <Logo size={48} />
                    </div>

                    {/* Email Input */}
                    <div className="my-4 w-full flex justify-center items-center space-x-2">
                        <Input
                            value={loginForm.email}
                            {...email_validation({ handleChange })}
                        />
                        <div className="mt-3">
                            <Tooltip title="Don't want to make an account? Use Login: jane.doe@gmail.com" />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4 w-full flex justify-center items-center space-x-2">
                        <Input
                            value={loginForm.password}
                            {...pw_validation({ handleChange })}
                        />
                        <div className="mt-3">
                            <Tooltip title="Password123!" />
                        </div>
                    </div>

                    <div className="mb-4 w-full grid justify-center items-center">
                        <Button
                            className="transition-colors duration-300"
                            type="submit"
                            onClick={logIn}
                            disabled={loading}
                        >
                            {loading ? "Logging In..." : "Log In"}
                        </Button>
                    </div>

                    <hr className="border-camel mt-10 mb-10" />
                    <Button
                        className="transition-colors duration-300"
                        onClick={() => navigate("/admin")}
                    >
                        To Admin View
                    </Button>
                    <hr className="border-camel mt-10 mb-10" />
                    <div className="grid grid-cols-1 gap-4 place-items-center">
                        <p>
                            Don't have an account?{" "}
                            <a href="#/signup" className="font-normal underline text-camel hover:font-extrabold">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default LogInPage;
