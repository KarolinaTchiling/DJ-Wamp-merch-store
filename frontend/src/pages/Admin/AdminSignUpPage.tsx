import React, {useState} from 'react';
import Logo from "../../components/Misc/Logo.tsx";
import Button from "../../components/Misc/Button.tsx";
import axios from "axios";
import Input from "../../components/Misc/Input.tsx";
import {
    email_validation, new_pw_validation,
} from "../../components/Misc/InputValidations.tsx";
import {FormProvider, useForm} from "react-hook-form";

const AdminSignUpPage: React.FC = () => {

    // form state starts with fields as empty strings
    const [signUpForm, setSignUpForm]
        = useState(
            {
                email: "",
                password:""
            });

    const methods = useForm();
    const signUp = methods.handleSubmit(() => {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: `${import.meta.env.VITE_BASE_URL}`, //can replace with personal port
            url: "/admin/signup", //flask route that handles signup auth
            data: {
                email: signUpForm.email.trim(),
                password: signUpForm.password.trim(),
            }
        }).then(async () => {
            console.log("sign up run" + signUpForm.email +". Now log in.");
            window.location.href = "/admin";
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })

        setSignUpForm(({
            email: "",
            password:"",
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
        <div className={"min-w-full flex justify-center"}>
        <FormProvider {...methods}>
        <form noValidate onSubmit={e => e.preventDefault()}
              className={"px-8 pt-6 pb-8 mb-4 max-w-[430px] h-auto grid items-center justify-center"}>
            <div className="flex justify-center"><Logo size={48} ></Logo></div>
            <p className="flex mb-4 justify-center">Admin Sign Up</p>

            <Input value={signUpForm.email} {...email_validation({handleChange})}/>
            <Input value={signUpForm.password} {...new_pw_validation({handleChange})}/>

            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} onClick={signUp}>Sign Up</Button>
            </div>

            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Already have an account? <a href={"/admin"} className={"font-normal underline text-camel hover:font-extrabold"}>
                    Log In</a></p>
            </div>
        </form>
        </FormProvider>
        </div>
    );
};

export default AdminSignUpPage;