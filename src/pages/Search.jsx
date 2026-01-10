import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { govtSpendingData } from '../data/govtSpendingData';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t } = useLanguage();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = govtSpendingData.filter(item =>
            item.id.toString().includes(lowerQuery) ||
            item.vendorName.toLowerCase().includes(lowerQuery) ||
            item.department.toLowerCase().includes(lowerQuery) ||
            item.scheme.toLowerCase().includes(lowerQuery) ||
            item.flagReason.toLowerCase().includes(lowerQuery) ||
            item.state.toLowerCase().includes(lowerQuery) ||
            item.district.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered);
    }, [query]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getRiskColor = (type) => {
        if (type === 'Low Risk') return 'bg-green-100 text-green-700';
        if (type === 'Multiple Flags' || type.includes('Spike')) return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            <h1 className="text-2xl font-bold text-[#0b1e3c] mb-4">
                Search Results for: <span className="text-yellow-600">"{query}"</span>
            </h1>

            {results.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <table className="min-w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-100 text-gray-900 border-b border-gray-200 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Department / Scheme</th>
                                <th className="px-6 py-3">Vendor / Entity</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {results.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-blue-700">#{item.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{item.department}</div>
                                        <div className="text-xs text-gray-500">{item.scheme}</div>
                                    </td>
                                    <td className="px-6 py-4">{item.vendorName}</td>
                                    <td className="px-6 py-4">
                                        <div>{item.district}</div>
                                        <div className="text-xs text-gray-500">{item.state}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{formatCurrency(item.amountDisbursed)}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.flagReason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(item.anomalyType)}`}>
                                            {item.anomalyType}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                    <i className="fas fa-search text-gray-300 text-4xl mb-4"></i>
                    <p className="text-gray-500 text-lg">No results found for "{query}"</p>
                    <p className="text-gray-400 text-sm">Try searching for a Vendor, Department, Scheme, or Location.</p>
                </div>
            )}
        </div>
    );
};

export default Search;
