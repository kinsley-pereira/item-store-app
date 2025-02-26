
import '../styles/component-error-alert.scss';

interface ErrorAlertProps {
    onRetry(): any;
    window?: boolean
}

/**
 * @description Displays a generic error message and a retry button with a callback
 * @param {() => any} onRetry - Function to call when retry button is clicked. MUST BE A MEMORIZED FUNCTION
 * @param {boolean} window - Display as an independent window
 * @returns {JSX.Element|null} The error alert element
 * @example
 * const loadData = useCallback(async () => {
 *     // Load data here
 * }, [])
 *
 * { hasError ? (
 *     <ErrorAlert />
 * ) : (
 *     // Elements after load
 * ) }
 */
export default function ErrorAlert({ onRetry, window }: ErrorAlertProps): JSX.Element | null {
    return <div className={`component-error-alert ${window ? 'app-window' : 'm-auto'}`}>
        <p>Something went wrong. <br></br>Please, try again.</p>
        <button onClick={onRetry}>Try Again</button>
    </div>
}