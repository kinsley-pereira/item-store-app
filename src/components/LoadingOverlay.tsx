import { createPortal } from "react-dom";
import Loader from "./Loader";

import '../styles/component-loading-overlay.scss';

/**
 * @description Renders a overlay to prevent user interaction during operations
 * @param {boolean} show - Whether to show the overlay
 * @returns {JSX.Element|null} The loading overlay element
 * 
 * @example
 * <LoadingOverlay show={processing}/>
 */
export default function LoadingOverlay({ show }: { show: boolean }): JSX.Element | null {
    const loadingOverlay = <div className="component-loading-overlay">
        <Loader/>
    </div>

    return show ? createPortal(loadingOverlay, document.body) : null
}