import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from '../components/LoadingOverlay';

// Mock the Loader component
jest.mock('../components/Loader', () => () => <div data-testid="loader">Loading...</div>);

describe('LoadingOverlay Component', () => {
    test('Renders overlay when show is true', () => {
        render(<LoadingOverlay show={true} />);

        const overlayElement = screen.getByText(/loading/i);
        expect(overlayElement).toBeInTheDocument();
    });

    test('Doesn\'t render overlay when show is false', () => {
        const { container } = render(<LoadingOverlay show={false} />);
        expect(container).toBeEmptyDOMElement();
    });
});
