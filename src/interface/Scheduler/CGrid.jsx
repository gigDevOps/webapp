import React from 'react';

export const CGridWrapper = ({ children, ...props }) => (
    <div style={{ display: 'flex', ...props.style }}>
        { children }
    </div>
)

export const CGridBlock = ({ children, ...props }) => (
    <div style={{ width: '12.5%', fontWeight: 500,
        textTransform: props.uppercase ? 'uppercase' : '',
        border: props.noBorder ? 'none' : '1px solid #eee', alignSelf: 'normal', ...props.style}}>
        { children }
    </div>
)
