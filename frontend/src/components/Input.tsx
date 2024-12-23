import React from "react";
import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";

// Define all the input attributes
type BaseInputAttributes = React.ComponentPropsWithoutRef<"input">;

// Extend the base input attributes
interface InputProps extends BaseInputAttributes {
    id: string;
    name: string;
    value?: string | number;
    handleChange?(event: React.ChangeEvent<HTMLInputElement>): void;
    validation?: {};
    label: string;
    htmlFor: string;
    className?: string;
    divClassName?: string;
    labelClassName?: string;
}


// Utility function to find specific input errors
const findInputError = (errors: FieldErrors<FieldValues>, name: string) => {
    const error = Object.keys(errors)
        .filter((key) => key.includes(name))
        .map((key) => errors[key])
        .shift();

    return error ? { error } : undefined;
};

// Utility function to safely get error message
const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.message && typeof error.message === "string") return error.message;
    return "Invalid input";
};

// Component to display input errors
const InputError: React.FC<{ message: React.ReactNode }> = ({ message }) => {
    return (
        <div className="flex items-center gap-1 px-2 font-semibold text-pink text-sm bg-red-100">
            <p className={"text-balance"}>{message}</p>
        </div>
    );
};

// Input component
const Input: React.FC<InputProps> = ({
    id,
    name,
    type,
    value,
    validation,
    handleChange,
    label,
    htmlFor,
    divClassName,
    className,
    labelClassName,
    ...rest
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const inputError = findInputError(errors, id);
    const isInvalid = Boolean(inputError);
    const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const labelDivStyle = "mb-4 w-full";

    return (
        <div className={divClassName || labelDivStyle}>
            <label htmlFor={htmlFor} className={labelClassName || ""}>
                {label}
            </label>

            {isInvalid && <InputError message={getErrorMessage(inputError?.error)} />}

            <input
                id={id}
                value={value}
                type={type}
                className={className || fieldStyle}
                placeholder={""}
                autoComplete={"on"}
                {...rest}
                {...register(id, validation)}
            />
        </div>
    );
};

export default Input;
