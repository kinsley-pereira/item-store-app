import { ReactNode, Ref, forwardRef, useEffect, useImperativeHandle, useState } from "react";

import '../styles/component-modal.scss';
import { createPortal } from "react-dom";

interface ModalProps {
    children?: ReactNode;
}

export interface ModalRef {
    show: () => void;
    hide: () => void;
}

/**
 * @description Renders a modal
 * @param {ReactNode} children - Elements to be included inside the modal
 * @param {any} ref - Ref to interact with the modal's exposed functions
 * @returns {JSX.Element|null} The modal or null if not open.
 * 
 * @example
 * const modalRef = useRef<{ show: () => void; hide: () => void }>(null);
 * 
 * const show = () => {
 *     modalRef.current?.show();
 * };
 * 
 * <Modal ref={modalRef}>
 *     <p>Modal content here.</p>
 * </Modal>
 */
function Modal({ children }: ModalProps, ref: Ref<ModalRef> | null): JSX.Element | null {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isShown, setIsShown] = useState<boolean>(false);

    // Expose functions for parent to control
    useImperativeHandle(ref, () => ({
        show: () => setIsOpen(true),
        hide: () => setIsShown(false)
    }));

    useEffect(() => {
        if (isOpen) setTimeout(() => setIsShown(true), 1) // Insert into body and then sho with animation
    }, [isOpen]);

    useEffect(() => {
        if (!isShown) setTimeout(() => setIsOpen(false), 300) // Hide with animation and then remove from body
    }, [isShown]);

    // Close on esc
    useEffect(() => {
        function handleKeyDown(ev: KeyboardEvent) {
            if (ev.key === 'Escape') setIsOpen(false)
        }

        window.addEventListener("keydown", handleKeyDown)
        
        return () =>
            window.removeEventListener("keydown", handleKeyDown)
        }
    , []);

    const modal = <div className={`modal-overlay ${isShown ? 'show' : ''}`} onClick={() => setIsShown(false)} data-testid="modal-overlay">
        <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
            {children}
        </div>
    </div>

    return isOpen ? createPortal(modal, document.body) : null;
}

export default forwardRef(Modal)