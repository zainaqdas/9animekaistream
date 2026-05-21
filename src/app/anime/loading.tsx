import React from 'react';
import Spinner from '@/components/Spinner';

const AnimeLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner text="Fetching Anime Details..." />
        </div>
    );
};

export default AnimeLoading;
