import React from 'react';
import { getRiskColor, getRiskBadgeColor } from '../utils/riskLogic';

const RiskTable = ({ data, onRowClick }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 mb-8">
            <div className="bg-white shadow border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    State
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    District
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Scheme
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Risk Score
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Anomaly
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Audit Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No records match the selected filters
                                    </td>
                                </tr>
                            ) : (
                                data.map((record) => (
                                    <tr
                                        key={record.id}
                                        className={`${getRiskColor(record.riskScore)} border-l-4 cursor-pointer hover:bg-gray-100 transition-colors duration-100`}
                                        onClick={() => onRowClick(record)}
                                        title="Click to view detailed risk analysis"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {record.state}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {record.district}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {record.scheme}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {record.vendorName}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${getRiskBadgeColor(record.riskScore)}`}
                                                title={`Risk Level: ${record.riskLevel}`}
                                            >
                                                {record.riskScore}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700" title={record.flagReason}>
                                            {record.anomalyType}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${record.auditStatus === 'Reviewed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.auditStatus === 'Escalated'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {record.auditStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.riskScore > 60 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                    ⚠ Review
                                                </span>
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
