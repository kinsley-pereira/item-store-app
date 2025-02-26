import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import IntegerInput from '../components/IntegerInput';

const Wrapper = ({ children }: any) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('IntegerInput Component', () => {
    test('Renders input with number type', () => {
        render(
            <Wrapper>
                <IntegerInput field="price" />
            </Wrapper>
        );

        const input = screen.getByTestId('integer-input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'number');
    });

    test('Accepts valid integer input', () => {
        render(
            <Wrapper>
                <IntegerInput field="price" />
            </Wrapper>
        );

        const input = screen.getByTestId('integer-input') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '123' } });
        expect(input.value).toBe('123'); // Input should show '123'
    });

    test('Disallows decimal and comma input', () => {
        render(
            <Wrapper>
                <IntegerInput field="price" />
            </Wrapper>
        );

        const input = screen.getByTestId('integer-input') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '123.45' } });
        expect(input.value).toBe('123'); // Input should show '123'

        fireEvent.change(input, { target: { value: '123,45' } });
        expect(input.value).toBe('123'); // Input should still show '123'
    });

    test('Sets value in form context', () => {
        const setValueMock = jest.fn();
        
        jest.spyOn(require('react-hook-form'), 'useFormContext').mockReturnValue({
            register: jest.fn(),
            setValue: setValueMock,
            watch: jest.fn(),
        });

        render(
            <Wrapper>
                <IntegerInput field="price" />
            </Wrapper>
        );

        const input = screen.getByTestId('integer-input') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '100' } });
        expect(setValueMock).toHaveBeenCalledWith('price', 100); // Check if setValue was called
    });
});
