import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

export default ({loading}) => {
    return (
        loading
            ?
                <div
                    style={{backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 1000}}
                    className="flex items-center justify-center fixed min-h-full left-0 right-0 top-0 bottom-0"
                >
                    <MoonLoader
                        size={40}
                        color={"white"}
                        loading={loading}
                    />
                </div>
            : null
    );
}
