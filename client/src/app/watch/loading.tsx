import React from 'react';
import Spinner from '@/components/Spinner';

const WatchLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner text="Preparing Your Stream..." />
        </div>
    );
};

export default WatchLoading;
