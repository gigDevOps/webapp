import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import filter from 'lodash/filter';
import pull from 'lodash/pull';
import union from 'lodash/union';
import isArray from 'lodash/isArray';

import Button from '../Button';
import { colors, shadows } from '../styles';
import iSearch from '../images/search.png';


/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, handleClick) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handleClick();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handleClick]);
}

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => { htmlElRef.current && htmlElRef.current.focus(); };

    return [htmlElRef, setFocus];
};

/**
 * @TODO Attach the filtering options with a callback.
 */
export default (props) => {
    const { type, options, onChange, placeholder, name, keyValue, filters } = props;
    const [isOpen, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const activeFilters = { key: keyValue, values: isArray(filters) ? filters : [] };
    const [inputRef, setInputFocus] = useFocus();

    const placeholderText = placeholder || 'Type to search...';
    const selectedText = activeFilters.values.length > 0 ? activeFilters.values.join(', ') : 'All';
    const currentSearch = filter(options, (o) => query === '' ? true : o.value.toLowerCase().includes(query.toLowerCase()));
    const wrapperRef = useRef(null);

    const handleFilters = (event) => {
        const f = event.target.checked
            ? union(activeFilters.values, [event.target.value])
            : pull(activeFilters.values, event.target.value);
        onChange(keyValue, f);
    };

    useOutsideAlerter(wrapperRef, () => {
        setOpen(false);
    });



    return (
        <li style={{ display: 'inline-block', listStyle: 'none', position: 'relative' }} ref={isOpen ? wrapperRef : null}>
            <Button
                onClick={() => { setOpen(!isOpen); setInputFocus(true); }}
                size="medium"
                type="link"
                style={{ background: 'none', color: '#333', border: 0, fontWeight: 400 }}
            >
                <div style={{ maxWidth: '15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                    <span style={{ fontWeight: 600 }}>{name}:</span> {selectedText}
                </div>
            </Button>
            <DropDownBox style={{ display: isOpen ? 'block' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DropDownFreeText
                        placeholder={placeholderText}
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <img src={iSearch} alt="Search" style={{ width: '1.75rem', height: '1.75rem', marginRight: '1rem' }} />
                </div>
                {
                    type === 'enum'
                        ? (
                            <div>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    { currentSearch.length < 1 ? <p>No matches</p> : '' }
                                    {currentSearch.map((option) => {
                                        const isChecked = activeFilters.values.indexOf(option.key) > -1;
                                        return (
                                            <DropDownLi>
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        handleFilters(e);
                                                    }}
                                                    key={option.key}
                                                    value={option.key}
                                                    checked={isChecked}
                                                /> {option.value}
                                            </DropDownLi>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : ''
                }
                {
                    type === 'text'
                        ? (
                            <div>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li><DropDownTitle>Search filters</DropDownTitle></li>
                                    <DropDownLi><input type="checkbox" /> Starts with</DropDownLi>
                                    <DropDownLi><input type="checkbox" /> Contains</DropDownLi>
                                    <DropDownLi><input type="checkbox" /> Ends with</DropDownLi>
                                </ul>
                            </div>
                        ) : ''
                }
            </DropDownBox>
        </li>
    );
};

const DropDownBox = styled.div`
    position: absolute;
    box-shadow: ${shadows.divShadow};
    top: 3.5rem;
    background: ${colors.white};
    border-radius: 3px;
    height: auto;
    width: auto;
    min-width: 225px;
    border: 1px solid #eee;
    font-size: 1.25rem;
    padding: 0.25rem 0;
    z-index: 1;
`;

const DropDownTitle = styled.p`
    font-weight: 600;
    margin: 0.5rem 1rem;
`;

const DropDownFreeText = styled.input`
    width: 100%;
    border: 0;
    padding: 1.25rem 1rem;
    outline: 0;
    font-size: 1.1rem;
    flex-grow: 1;
`;

const DropDownLi = styled.li`
    padding: 0.5rem 1rem;
    :hover {
        background: ${colors.grey};
    }
`;
