import React, {useRef, useState} from "react";
import fuzzysort from "fuzzysort";
import xorBy from "lodash/xor";
import differenceBy from "lodash/differenceBy";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";

import styled from 'styled-components';

export default function Autoselect({ options, onChange, isCreatable, renderCreation, maxSelection }) {
    const [query, setQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selection, setSelection] = useState([]);
    const ref = useRef();
    useOnClickOutside(ref, () => {
        setQuery("");
        setIsCreating(false);
    })

    const select = (key, value) => {
        let update = xorBy([{ key: key, value: value}], selection, 'key');
        if(maxSelection === 1) {
            update = [{ key: key, value: value}];
        }
        setSelection(update);
        setQuery("");
        onChange(update);
    }

    const remove = (key, value) => {
        const updateSelection = differenceBy(selection, [{ key: key, value: value}], 'key');
        setSelection(updateSelection);
        onChange(updateSelection);
    }

    const fuzzyResults = fuzzysort.go(query, options, { key: 'value', allowTypo: true, limit: 50});
    const results = fuzzyResults.map((s) => {
        return { key: s.obj.key, value: s.obj.value };
    });
    const available = differenceBy(results, selection, 'key');

    return(
        <div style={{ width: "100%", position: "relative"}}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div ref={ref} style={{ position: "absolute", zIndex: 2, border: "1px solid #ddd", background: "#fff", width: "100%", display: query.length > 0 ? "block" : "none"}}>
                <div style={{padding: "0.5rem"}}>
                    {available.map((o) => {
                        return <div onClick={() => select(o.key, o.value)} key={o.key}><p>{o.value}</p></div>
                    })}
                </div>
                { isCreatable && (
                    <div style={{padding: "0.5rem"}}>
                        {
                            !isCreating
                            ? (
                                    <p onClick={() => setIsCreating(true)}>
                                        Create "<span style={{textTransform: "capitalize"}}>{query}</span>"
                                    </p>
                                ) : ""
                        }
                        {isCreating && renderCreation(query)}
                    </div>
                )}
            </div>
            <div style={{display: "flex"}}>
                <p>
                {selection.map((s) => {
                    return <Tag key={s.key}>{s.value} <span onClick={() => remove(s.key, s.value)}>x</span></Tag>
                })}
                </p>
            </div>
        </div>
    )
}

Autoselect.defaultProps = {
    maxSelection: null
}

const Tag = styled.span`
    font-size: 90%;
    padding: 0.5rem 1rem;
    display: inline-block;
    margin: 0.5rem;
    margin-left: 0;
    background: #339966;
    color: #fff;
    font-weight: 500;
`