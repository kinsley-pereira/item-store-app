import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import useOnBlur from "../hooks/useOnBlur";

import '../styles/component-select.scss';

/**
 * Props for the Select component.
 * 
 * @template T - The type of the options in the select
 */
export interface SelectProps<T extends Record<string, any>> {
    id?: string;
    placeholder?: string;
    field?: string;
    options: T[];
    trackBy: keyof T;
    label: keyof T;
    validation?: any;
    onSelect?(option: T|null): void;
}

/**
 * @description A select component with search and optional integration with react-hook-form.
 * @template T - The type of the options in the select
 * 
 * @param {SelectProps<T>} props - The properties for the Select component.
 * @returns {JSX.Element} The rendered select component.
 * 
 * @example
 * const options = [{ id: 1, label: 'Option 1' }, { id: 2, label: 'Option 2' }];
 * 
 * <Select
 *     id="example-select"
 *     options={options}
 *     trackBy="id"
 *     label="label"
 *     onSelect={(option) => console.log(option)}
 * />
 */
export default function Select<T extends Record<string, any>>({ id, placeholder, field, options, trackBy, label, validation, onSelect }: SelectProps<T>): JSX.Element | null {
    const [selected, setSelected] = useState<T|null>(null);
    const [active, setActive] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { register, setValue, trigger } = useFormContext() || {};

    const ref = useRef<any>(null);

    // Filter items accoding to search query
    const filteredOptions = useMemo(() => {
        let query = searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); // Normalize to remove accents
        return query ? options.filter(el => el.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query)) : options;
    }, [searchQuery, options]);

    useEffect(() => {
        if (selected && !options.find(el => el.id === selected.id)) setSelected(null); // In case the item is not on the list anymore
    }, [options, selected]);

    useEffect(() => {
        onSelect?.(selected); // Used in alternative to react-hook-form register
    }, [selected, onSelect]);

    useOnBlur(ref, () => setActive(false));

    // Open and close on keypress
    function handleKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
        switch (ev.key) {
            case 'Enter': setActive(true); break;
            case 'Escape': setActive(false); break;
            default: break;
        }
    }

    function select(option: T) {
        setSelected(option);
        setActive(false);
        if (field) {
            setValue(field, option[trackBy]);
            trigger(field);
        }
    }

    return <div className="component-select-container" ref={ref}>
        <input id={id} type="text" className="select-input" placeholder={placeholder}
            value={active ? searchQuery : selected?.[label] || ''} readOnly={!active}    
            onClick={() => setActive(true)}
            onKeyDown={handleKeyDown} onChange={ev => setSearchQuery(ev.target.value)}
            data-testid="select-input"
        />
        {field && <input type="hidden" data-testid="select-input-hidden" {...register(field, validation)} value={selected?.[trackBy] || ''} />}
        <div className="select-list">
            <ul className={ active ? 'open' : '' } tabIndex={-1}>
                {filteredOptions.map(option => (
                    <li className={ option.id === selected?.id ? 'selected' : '' } key={option[trackBy]} onClick={() => select(option)} tabIndex={ active ? 0 : -1}>{option[label]}</li>
                ))}
            </ul>
        </div>
    </div>
}