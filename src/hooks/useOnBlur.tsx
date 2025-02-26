import { useEffect } from "react";

/**
 * @description Hook that triggers a callback when the focus is not inside or in the wrapper element
 * @param {React.MutableRefObject<any>} ref - Ref of the element to be used as wrapper
 * @param {() => void} onBlur - Callback function to be called when the focus leaves the wrapper
 * 
 * @example
 * const wrapperRef = useRef(null);
 *
 * useOnBlur(wrapperRef, () => {
 *     console.log('Focus is out of the wrapper');
 * });
 *
 * return <div ref={wrapperRef}>
 *     <input type="text" />
 *     <input type="text" />
 * </div>;
 */
export default function useOnBlur(ref: React.MutableRefObject<any>, onBlur: () => void) {
    const wrapper = ref.current;

    useEffect(() => {
        function handleFocusOut(ev: FocusEvent) {        
            if (wrapper && !wrapper.contains(ev.relatedTarget as Node)) { // Checks if current active element is contained by the wrapper
                onBlur();
            }
        }

        if (wrapper) wrapper.addEventListener("focusout", handleFocusOut);

        return () => {
            if (wrapper) wrapper.removeEventListener("focusout", handleFocusOut);
        }
    }, [wrapper, onBlur])
}