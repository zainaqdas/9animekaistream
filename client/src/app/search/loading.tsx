import React from 'react';

const SearchLoading = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-28 pb-12 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative mb-12">
                <div className="w-20 h-20 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
            </div>
            
            <div className="space-y-4 w-full max-w-4xl">
                <div className="h-8 bg-card rounded-lg w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[2/3] bg-card rounded-2xl animate-pulse"></div>
                            <div className="h-4 bg-card rounded w-3/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchLoading;
