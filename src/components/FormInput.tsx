import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { FieldErrors, Path, RegisterOptions, useFormContext } from "react-hook-form";

import Select, { SelectProps } from "./Select";
import IntegerInput from "./IntegerInput";

import '../styles/component-form-input.scss';

interface RadioOption {
    key: string | number;
    label: string;
};

interface FormInputProps<T extends Record<string, any>, U extends Record<string, any>> {
    id: string;
    type?: HTMLInputTypeAttribute | 'select' | 'integer';
    label?: string;
    placeholder?: string;
    field: Path<T>;
    validation?: RegisterOptions<T , Path<T>>; // react-hook-form validation options
    disabled?: boolean;
    selectProps?: SelectProps<U>; // Needed only when type === select
    options?: RadioOption[]; // Needed only when type === radio
    [x: string]: any;
};

/**
 * @description Creates a input with associated label and erro message using formContext
 * @template T - Form values type
 * @template U - Select type
 * @param {string} id - Unique id for input
 * @param {HTMLInputTypeAttribute | 'select' | 'integer'} type - Input type to be generated
 * @param {string} label - Input associated label
 * @param {string} placeholder - Input placeholder
 * @param {Path} field - Form field to register input
 * @param {RegisterOptions<T , Path<T>} validation - Validation options
 * @param {boolean} disabled - Input disabled attribute
 * @param {SelectProps<U extends Record<string, any>>} selectProps - Additional attributes needed if it's a select type
 * @param {RadioOption[]} options - Array of radio options
 * @returns {JSX.Element|null} A element containing label, input or equivalent and erro message if needed
 * @example
 * interface FormValues {
 *     name: string;
 *     // Form values here
 * }
 * 
 * <FormInput<FormValues> id='form-input-id' label='Name' type='text' field='name' validation={{required: true}}/>
 */
export default function FormInput<T extends {}>({ id, type = 'text', label, placeholder, field, validation, disabled, selectProps, options, ...rest }: FormInputProps<T, any>): JSX.Element | null {
    const { formState, register } = useFormContext<T>();
    const [errorMessage, setErrorMessage] = useState<any>();

    // Update error message
    useEffect(() => {
        const error = formState.errors[field as keyof FieldErrors<T>];
        setErrorMessage(error ? (error.message || 'This field is required') : '');
    }, [formState, field]);

    return <div className="form-input-container">
        {label && <label htmlFor={id}>{label}</label>}
        { type === 'select' ? (
            selectProps && <Select id={id} placeholder={placeholder} field={field} {...selectProps } validation={validation} />
        ) : type === 'radio' && options ? (
            <div className="radio-group">
                {options.map(option => (
                    <div key={option.key}>
                        <label htmlFor={`${id}-${option.key}`}>{option.label}</label>
                        <input id={`${id}-${option.key}`} type="radio" value={option.key} disabled={disabled} {...register(field, validation)}/>
                    </div>
                ))}
            </div>
        ) : type === 'integer' ? (
            <IntegerInput id={id} type={type} placeholder={placeholder} disabled={disabled} field={field} validation={validation} {...rest}/>
        ) : (
            <input id={id} type={type} placeholder={placeholder} disabled={disabled} {...register(field, validation)} {...rest}/>
        )}
        {errorMessage && <span className="input-error-message">{errorMessage}</span>}
    </div>
}