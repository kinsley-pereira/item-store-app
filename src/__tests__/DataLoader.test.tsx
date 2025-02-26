import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataLoader from '../components/DataLoader';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

jest.mock('../components/Loader', () => () => <div>Loading...</div>);
jest.mock('../components/ErrorAlert', () => ({ onRetry }: { onRetry: () => void }) => (
    <div>
        <span>Error occurred!</span>
        <button onClick={onRetry}>Retry</button>
    </div>
));

describe('DataLoader Component', () => {
    const mockLoad = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Displays loader during on load state', () => {
        mockLoad.mockImplementation(() => new Promise(() => {})); // Pending promise
        render(<DataLoader load={mockLoad}><div>Loaded</div></DataLoader>);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('Displays error alert on load failure', async () => {
        mockLoad.mockImplementation(() => Promise.reject(new Error('Load failed')));
        render(<DataLoader load={mockLoad}><div>Loaded</div></DataLoader>);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Error occurred!')).toBeInTheDocument();
        });
    });

    test('Displays children on successful load', async () => {
        mockLoad.mockImplementation(() => Promise.resolve());
        render(<DataLoader load={mockLoad}><div>Loaded</div></DataLoader>);

        await waitFor(() => {
            expect(screen.getByText('Loaded')).toBeInTheDocument();
        });
    });

    test('Retries loading on button click', async () => {
        mockLoad.mockImplementationOnce(() => Promise.reject(new Error('Load failed')))
                 .mockImplementationOnce(() => Promise.resolve());

        render(<DataLoader load={mockLoad}><div>Loaded</div></DataLoader>);

        await waitFor(() => {
            expect(screen.getByText('Error occurred!')).toBeInTheDocument();
        });

        screen.getByRole('button', { name: /retry/i }).click();

        await waitFor(() => {
            expect(screen.getByText('Loaded')).toBeInTheDocument();
        });
    });
});