import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorAlert from '../components/ErrorAlert';

describe('ErrorAlert Component', () => {
    test('Renders error message', () => {
        render(<ErrorAlert onRetry={jest.fn()} />);
        
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/please, try again/i)).toBeInTheDocument();
    });

    test('Calls onRetry function when retry button is clicked', () => {
        const onRetryMock = jest.fn();
        render(<ErrorAlert onRetry={onRetryMock} />);

        const button = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(button);

        expect(onRetryMock).toHaveBeenCalledTimes(1); // Ensure onRetry is called once
    });
});