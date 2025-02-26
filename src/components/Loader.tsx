import '../styles/component-loader.scss'

/**
 * @description Renders a simple loading animation
 * @returns {JSX.Element|null} The loader element
 * 
 * @example
 * { isLoading ? (
 *     <Loader />
 * ) : (
 *     // Elements after load
 * ) }
 */
export default function Loader(): JSX.Element | null {
    return <div className="loader-bars m-auto" role="presentation">
        { Array.from({ length: 3 }).map((_, index) => <div key={index}></div>) }
    </div>
}