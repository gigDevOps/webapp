import React from 'react';

export default function LoadingView({ isFetching, children }) {
        return (
            <div>
                { isFetching ? <p>Loading...</p> : children }
            </div>
        )
}