import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
            <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by district, vendor, or scheme..."
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors duration-150"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
