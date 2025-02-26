import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../components/FormInput'; // Adjust the import path accordingly
import '@testing-library/jest-dom/extend-expect'; // for additional matchers

// Wrapper for react-hook-form context
const Wrapper = ({ children }: any) => {
	const methods = useForm({mode: 'all'});
	return <FormProvider {...methods}><form role="form" onSubmit={methods.handleSubmit(() => {})}>{children}</form></FormProvider>;
};

// Test data for select
const selectOptions = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
];

// Test data for radio
const radioOptions = [
    { key: 'option1', label: 'Option 1' },
    { key: 'option2', label: 'Option 2' },
];

describe('FormInput Component', () => {
    test('Render a text input with label', () => {
        render(
            <Wrapper>
                <FormInput id="text-input" label="Text Input" placeholder="Text Input" type="text" field="textField" />
            </Wrapper>
        );

        expect(screen.getByLabelText(/text input/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/text input/i)).toBeInTheDocument();
    });

    test('Renders a select input with options', () => {
        render(
            <Wrapper>
                <FormInput id="select-input" label="Select Input" type="select" field="selectField"
                    selectProps={{ options: selectOptions, trackBy: 'id', label: 'label' }}
                />
            </Wrapper>
        );

        const input = screen.getByTestId('select-input') as HTMLInputElement;
		fireEvent.click(input); // Open select dropdown
		fireEvent.click(screen.getByText('Option 1')); // Select option

        const inputHidden = screen.getByTestId('select-input-hidden') as HTMLInputElement;
		expect(inputHidden).toBeInTheDocument(); // Ensure hidden input is registered
		expect(inputHidden.value).toBe('1'); // Ensure hidden input has the selected value
    });

    test('Renders radio buttons and selects one', () => {
        render(
            <Wrapper>
                <FormInput id="radio-input" label="Radio Input" type="radio" field="radioField" options={radioOptions}/>
            </Wrapper>
        );

        const radioButton = screen.getByLabelText(/option 1/i) as HTMLInputElement;
        fireEvent.click(radioButton);
        
        expect(radioButton).toBeChecked();
    });

    test('Renders an integer input', () => {
        render(
            <Wrapper>
                <FormInput
                id="integer-input"
                label="Integer Input"
                type="integer"
                field="integerField"
                />
            </Wrapper>
        );

        expect(screen.getByLabelText(/integer input/i)).toBeInTheDocument();
    });

    test('Displays error message when field is invalid', async () => {
        render(
            <Wrapper>
                <FormInput id="required-input" label="Required Input" type="text" field="requiredField" validation={{ required: 'This field is required' }}/>
            </Wrapper>
        );

        // Trigger form validation
        fireEvent.submit(screen.getByRole('form'));

        expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
    });
});
