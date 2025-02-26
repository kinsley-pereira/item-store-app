import { ReactNode, useCallback, useEffect, useState } from "react";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";

interface DataLoaderProps {
    load(): Promise<any>;
    children: ReactNode;
}


/**
 * @description Wraps elements to be hidden and replaced during load and error states
 * @param {() => Promise<any>} load - Function to load the data. MUST BE A MEMORIZED FUNCTION
 * @param {any} children - Children elements to be rendered after load
 * @returns {JSX.Element|null} Return Loader, ErrorAlert or children, based on load state
 * 
 * @example
 * const loadData = useCallback(async () => {
 *     // Load data here
 * }, [])
 *
 * <DataLoader load={loadData}>
 *     <p>Display when data is loaded</p>
 * </DataLoader>
 */
export default function DataLoader({ load, children }: DataLoaderProps): JSX.Element | null {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    const loadPageData = useCallback(() => {
        setHasError(false);
        setIsLoading(true);

        load().catch(() => {
            setHasError(true);
        }).finally(() => setIsLoading(false));
    }, [load]);

    useEffect(loadPageData, [loadPageData]);

    if (isLoading) return <Loader/>
    else if (hasError) return <ErrorAlert onRetry={loadPageData}/>

    return <>{children}</>
}