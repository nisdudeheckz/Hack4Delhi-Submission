import React, { useState, useMemo } from 'react';
import { getRiskColor, getRiskBadgeColor } from '../utils/riskLogic';

const RiskTable = ({ data, onRowClick, riskThreshold = 75 }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle special cases
                if (sortConfig.key === 'amountDisbursed' || sortConfig.key === 'riskScore' || sortConfig.key === 'id') {
                    if (typeof aValue === 'string' && !isNaN(aValue)) aValue = Number(aValue);
                    if (typeof bValue === 'string' && !isNaN(bValue)) bValue = Number(bValue);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) {
            return <i className="fas fa-sort text-gray-400 ml-1"></i>;
        }
        if (sortConfig.direction === 'ascending') {
            return <i className="fas fa-sort-up text-blue-600 ml-1"></i>;
        }
        return <i className="fas fa-sort-down text-blue-600 ml-1"></i>;
    };

    const HeaderCell = ({ label, sortKey, className = "px-4 py-3 cursor-pointer select-none hover:bg-gray-200" }) => (
        <th
            className={className}
            onClick={() => requestSort(sortKey)}
            title={`Sort by ${label}`}
        >
            <div className="flex items-center">
                {label} {getSortIcon(sortKey)}
            </div>
        </th>
    );

    return (
        <div className="w-full mt-6 mb-8">
            <div className="bg-white shadow border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-100 text-gray-900 border-b border-gray-200 uppercase text-xs font-bold">
                            <tr>
                                <HeaderCell label="ID" sortKey="id" />
                                <HeaderCell label="Department / Scheme" sortKey="department" />
                                <HeaderCell label="Vendor / Entity" sortKey="vendorName" />
                                <HeaderCell label="Location" sortKey="district" />
                                <HeaderCell label="Amount" sortKey="amountDisbursed" />
                                <HeaderCell label="Reason" sortKey="flagReason" />
                                <HeaderCell label="Score" sortKey="riskScore" />
                                <HeaderCell label="Risk Level" sortKey="anomalyType" />
                                <HeaderCell label="Reference" sortKey="sourceType" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                                        No records match the selected filters
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => onRowClick(record)}
                                    >
                                        <td className="px-4 py-4 font-medium text-blue-700">#{record.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-gray-900">{record.department}</div>
                                            <div className="text-xs text-gray-500">{record.scheme}</div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-900">{record.vendorName}</td>
                                        <td className="px-4 py-4">
                                            <div className="text-gray-900">{record.district}</div>
                                            <div className="text-xs text-gray-500">{record.state}</div>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-gray-900">
                                            {formatCurrency(record.amountDisbursed)}
                                        </td>
                                        <td className="px-4 py-4 text-gray-600 w-1/4">
                                            {record.flagReason}
                                        </td>
                                        <td className="px-4 py-4 font-bold text-gray-800">
                                            {record.riskScore}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${record.riskScore >= riskThreshold ? 'bg-red-100 text-red-700' :
                                                    record.riskScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {record.anomalyType || 'Low Risk'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {record.sourceUrl ? (
                                                <a
                                                    href={record.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {record.sourceType || 'Source'} <i className="fas fa-external-link-alt text-[10px]"></i>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RiskTable;
