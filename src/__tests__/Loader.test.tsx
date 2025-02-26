import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader Component', () => {
    test('Renders the loader', () => {
        render(<Loader />);

        // Check if the loader element is in the document
        const loaderElement = screen.getByRole('presentation');
        expect(loaderElement).toBeInTheDocument();
    });
});