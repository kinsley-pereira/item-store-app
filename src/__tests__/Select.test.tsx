import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import Select from '../components/Select';

// Test data
const options = [
  { id: 1, name: 'Option 1', label: 'Option 1' },
  { id: 2, name: 'Option 2', label: 'Option 2' },
  { id: 3, name: 'Option 3', label: 'Option 3' },
];

// Wrapper for react-hook-form context
const Wrapper = ({ children }: any) => {
	const methods = useForm();
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Select Component', () => {
	test('Renders with provided options', () => {
		render(
			<Select id="example" options={options} trackBy="id" label="label" />
		);
		expect(screen.getByTestId('select-input')).toBeInTheDocument();
		expect(screen.getByText('Option 1')).toBeInTheDocument();
		expect(screen.getByText('Option 2')).toBeInTheDocument();
	});

	test('Filters options based on search query', () => {
		render(
			<Select id="example" options={options} trackBy="id" label="label" />
		);

		const input = screen.getByTestId('select-input');
		fireEvent.click(input); // Open select dropdown
		fireEvent.change(input, { target: { value: '2' } }); // Type in search field

		// Check if filter worked
		expect(screen.getByText('Option 2')).toBeInTheDocument(); 
		expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
	});

	test('Selects an option and calls onSelect', () => {
		const onSelectMock = jest.fn();
		render(
			<Select id="example" options={options} trackBy="id" label="label" onSelect={onSelectMock} />
		);

		const input = screen.getByTestId('select-input') as HTMLInputElement;
		fireEvent.click(input); // Open select dropdown
		fireEvent.click(screen.getByText('Option 1')); // Select option

		expect(onSelectMock).toHaveBeenCalledWith(options[0]); // Ensure onSelect callback was called
		expect(input.value).toBe('Option 1'); // Ensure input has the selected option
	});

	test('Registers with react-hook-form', () => {
		render(
			<Wrapper>
				<Select id="example" options={options} trackBy="id" label="label" field="selectField" />
			</Wrapper>
		);

		const input = screen.getByTestId('select-input') as HTMLInputElement;
		fireEvent.click(input); // Open select dropdown
		fireEvent.click(screen.getByText('Option 1')); // Select option

		const inputHidden = screen.getByTestId('select-input-hidden') as HTMLInputElement;
		expect(inputHidden).toBeInTheDocument(); // Ensure hidden input is registered
		expect(inputHidden.value).toBe('1'); // Ensure hidden input has the selected value
	});
});
