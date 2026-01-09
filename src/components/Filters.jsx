import React from 'react';

const Filters = ({ data, filters, setFilters }) => {
    // Extract unique values for dropdowns
    const states = ['All States', ...new Set((data || []).map(d => d.state))];
    const departments = ['All Departments', ...new Set((data || []).map(d => d.department))];
    const schemes = ['All Schemes', ...new Set((data || []).map(d => d.scheme))];
    const riskLevels = ['All Risk Levels', 'High', 'Medium', 'Low'];

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                            State
                        </label>
                        <select
                            value={filters.state}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                            Department
                        </label>
                        <select
                            value={filters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                            Scheme
                        </label>
                        <select
                            value={filters.scheme}
                            onChange={(e) => handleFilterChange('scheme', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {schemes.map(scheme => (
                                <option key={scheme} value={scheme}>{scheme}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                            Risk Level
                        </label>
                        <select
                            value={filters.riskLevel}
                            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {riskLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
