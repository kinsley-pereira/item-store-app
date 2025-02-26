import { Path, RegisterOptions, useFormContext } from "react-hook-form";

interface IntegerInputProps {
    field: Path<any>;
    validation?: RegisterOptions<any>; // react-hook-form validation options
    [x: string]: any;
}

/**
 * @description Creates a number input with validations to accept integers only
 * @param {Path} field - Form field to register input
 * @param {RegisterOptions<any>} validation - Validation options
 * @returns {JSX.Element|null} Input element with type number
 * 
 * @example
 * interface FormValues {
 *     price: string;
 *     // Form values here
 * }
 * 
 * <IntegerInput id='input-price' field='price' validation={{ required: true }}/>
 */
export default function IntegerInput({ field, validation, ...props }: IntegerInputProps): JSX.Element | null {
    const { register, setValue, watch } = useFormContext();

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        if (!ev.target.value) return
        const value = parseInt(ev.target.value.replace(/(\.|,).*/, ''));
        field && setValue(field, value as any);
    }

    function onKeydown(ev: React.KeyboardEvent<HTMLInputElement>) {
        if (['.', ','].includes(ev.key)) ev.preventDefault();
    }

    const inputValue = watch(field)

    return <input {...props} type="number" value={inputValue} {...register(field, validation)} onChange={onChange} onKeyDown={onKeydown} data-testid="integer-input"/>
}