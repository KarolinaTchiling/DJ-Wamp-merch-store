import React, {useState} from 'react';
import Logo from "../components/Misc/Logo.tsx";
import Button from "../components/Misc/Button.tsx";
import axios from "axios";
import Input from "../components/Misc/Input.tsx";
import {
    email_validation, new_pw_validation,
} from "../components/Misc/InputValidations.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {fname_validation, lname_validation} from "../components/Misc/InputValidations.tsx";
import {useTokenContext} from "../contexts/TokenContext.tsx";
import Loader from "../components/Misc/Loader.tsx";

const SignUpPage: React.FC = () => {
    const {setToken, setUserType} = useTokenContext();
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    
    // form state starts with fields as empty strings
    const [signUpForm, setSignUpForm]
        = useState(
            {
                fname: "",
                lname: "",
                email: "",
                password:"",
                card: "",
                street: "",
                city: "",
                province: "",
                postal: ""
            });
    const methods = useForm();
    const signUp = methods.handleSubmit(() => {
        setLoading(true);
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: `${import.meta.env.VITE_BASE_URL}`, //can replace with personal port
            url: "/signup", //flask route that handles signup auth
            data: {
                email: signUpForm.email.trim(),
                password: signUpForm.password.trim(),
                fname: signUpForm.fname.trim(),
                lname: signUpForm.lname.trim(),
                card: signUpForm.card.trim(),
                street: signUpForm.street.trim(),
                city: signUpForm.city.trim(),
                province: signUpForm.province.trim(),
                postal: signUpForm.postal.trim()
            }
        }).then(() => {
            console.log("Sign up successful. Logging in now...");
            // Automatically log in the user
            return axios({
                method: "post",
                baseURL: `${import.meta.env.VITE_BASE_URL}`,
                url: "/login",
                data: {
                    email: signUpForm.email.trim(),
                    password: signUpForm.password.trim(),
                }
            });
        }).then(async (response) => {
            console.log("Log in successful: " + signUpForm.email);
            setToken(response.data.token);
            setUserType("user");
            window.location.href = "/"; // Redirect them to the merch page
        }).catch((error) => {
            if (error.response) {
                console.error("Error occurred:", error.response);
            }
        }).finally(() => {
            setLoading(false); // Set loading to false after login is complete
        });

        setSignUpForm(({
            fname: "",
            lname: "",
            email: "",
            password:"",
            card: "",
            street: "",
            city: "",
            province: "",
            postal: ""
        }))
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the signUpForm state whenever a field changes
        const {value, name} = event.target
        setSignUpForm(prevNote => ({
            ...prevNote, [name]: value})
        );
        methods.trigger(name);
    }

    return (
        <div className={"relative flex justify-center"}>

        {/* Loading Overlay */}
        {loading && (
                <div className="absolute inset-0 bg-cream bg-opacity-100 flex items-center justify-center z-10 flex-col">
                    <div className="text-coffee text-xl mb-6">Creating an Account and Logging In</div>
                    <Loader />
                </div>
        )}

        <FormProvider {...methods}>
        <form noValidate onSubmit={e => e.preventDefault()}
            className="rounded px-8 pt-6 pb-8 mb-4 max-w-[430px] h-auto grid items-center justify-center">
            <div className="flex mb-4 justify-center"><Logo size={48} ></Logo></div>
            <Input value={signUpForm.fname} {...fname_validation({handleChange})}/>
            <Input value={signUpForm.lname} {...lname_validation({handleChange})}/>
            <Input value={signUpForm.email} {...email_validation({handleChange})}/>
            <Input value={signUpForm.password} {...new_pw_validation({handleChange})}/>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} onClick={signUp}>Sign Up</Button>
            </div>

            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Already have an account? <a href={"#/login"} className={"font-normal underline text-camel hover:font-extrabold"}>
                    Log In</a></p>
            </div>
        </form>
        </FormProvider>
        </div>
    );
};

export default SignUpPage;