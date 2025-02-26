// Modal.test.tsx
import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Modal from '../components/Modal';

describe('Modal Component', () => {
    const TestComponent = () => {
        const modalRef = useRef<{ show: () => void; hide: () => void }>(null);
        return (
            <>
                <button onClick={() => modalRef.current?.show()}>Open Modal</button>
                <Modal ref={modalRef}>
                    <p>Modal content here.</p>
                </Modal>
            </>
        );
    };

    test('does not render modal when not open', () => {
        render(<TestComponent />);
        expect(screen.queryByText(/modal content here/i)).not.toBeInTheDocument();
    });

    test('renders modal when show is called', () => {
        render(<TestComponent />);
        fireEvent.click(screen.getByText(/open modal/i));
        expect(screen.getByText(/modal content here/i)).toBeInTheDocument();
    });

    test('closes modal when overlay is clicked', async () => {
        render(<TestComponent />);
        fireEvent.click(screen.getByText(/open modal/i));
        expect(screen.getByText(/modal content here/i)).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('modal-overlay'));
        
        // Wait for the modal to be removed after animation
        await waitFor(() => {
            expect(screen.queryByText(/modal content here/i)).not.toBeInTheDocument();
        });
    });

    test('closes modal when escape key is pressed', async () => {
        render(<TestComponent />);
        fireEvent.click(screen.getByText(/open modal/i));
        expect(screen.getByText(/modal content here/i)).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'Escape' }); // Close modal
        
        // Wait for the modal to be removed after animation
        await waitFor(() => {
            expect(screen.queryByText(/modal content here/i)).not.toBeInTheDocument();
        });
    });

    test('modal hides after animation delay when closed', async () => {
        jest.useFakeTimers();
        render(<TestComponent />);

        fireEvent.click(screen.getByText(/open modal/i)); // Open modal
        fireEvent.click(screen.getByTestId('modal-overlay')); // Close modal

        // Fast-forward timers
        jest.runAllTimers();
        
        await waitFor(() => {
            expect(screen.queryByText(/modal content here/i)).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });
});
