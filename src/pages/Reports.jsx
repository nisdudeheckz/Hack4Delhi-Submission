// ... imports
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { exportToCSV, exportHighRiskOnly, exportAuditReport, generateAuditSummary } from '../utils/exportData';
import RiskTable from '../components/RiskTable'; // Ensure RiskTable is imported

const Reports = () => {
    const { enrichedData, auditFeedback, riskThreshold } = useData();
    const [activeFilter, setActiveFilter] = useState(null); // 'all', 'highRisk', 'reviewed', 'fundsRisk'

    const summary = useMemo(() => {
        return generateAuditSummary(enrichedData, auditFeedback, riskThreshold);
    }, [enrichedData, auditFeedback, riskThreshold]);

    const handleExportAll = () => {
        exportToCSV(enrichedData, 'full_dataset.csv');
    };

    const handleExportHighRisk = () => {
        exportHighRiskOnly(enrichedData);
    };

    const handleExportAuditReport = () => {
        exportAuditReport(enrichedData, auditFeedback);
    };

    const filteredReportData = useMemo(() => {
        if (!activeFilter) return [];

        // Reusing logic from exportData via helper or duplicating for view simplicity
        // Ideally we'd export isEffectiveHighRisk but for now we inline similar simple logic

        switch (activeFilter) {
            case 'all':
                return enrichedData;
            case 'highRisk':
            case 'fundsRisk': // Funds risk just shows the high risk cases that contribute to the funds
                return enrichedData.filter(record => {
                    const feedback = auditFeedback[record.id]?.status;
                    if (feedback === 'false_alarm') return false;
                    if (feedback === 'valid') return true;
                    return record.riskScore > 75;
                });
            case 'reviewed':
                return enrichedData.filter(record => auditFeedback[record.id]);
            case 'validConcerns':
                return enrichedData.filter(record => auditFeedback[record.id]?.status === 'valid');
            case 'falseAlarms':
                return enrichedData.filter(record => auditFeedback[record.id]?.status === 'false_alarm');
            default:
                return [];
        }
    }, [enrichedData, activeFilter, auditFeedback, riskThreshold]);

    return (
        <div className="w-full">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                {/* ... Header ... */}
                <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
                    Audit Reports & Analytics
                </h1>

                {/* Summary Statistics */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#0b3c6f] mb-4">Audit Summary</h2>
                    <p className="text-sm text-gray-600 mb-4">Click on a card to view details below.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Cases */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'all' ? null : 'all')}
                            className={`cursor-pointer bg-white p-6 rounded shadow-sm border-l-4 border-[#0b3c6f] transition-all
                                ${activeFilter === 'all' ? 'ring-2 ring-blue-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="font-bold text-lg mb-2 text-[#0b3c6f] uppercase tracking-wide">Total Cases</h3>
                            <p className="mt-2 text-4xl font-bold text-gray-900">{summary.totalCases}</p>
                        </div>

                        {/* High Risk */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'highRisk' ? null : 'highRisk')}
                            className={`cursor-pointer bg-white p-6 rounded shadow-sm border-l-4 border-red-600 transition-all
                                ${activeFilter === 'highRisk' ? 'ring-2 ring-red-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="font-bold text-lg mb-2 text-red-700 uppercase tracking-wide">High-Risk Cases</h3>
                            <p className="mt-2 text-4xl font-bold text-red-600">{summary.highRiskCases}</p>
                            <p className="mt-1 text-xs text-gray-500">Score &gt; {riskThreshold}</p>
                        </div>

                        {/* Reviewed */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'reviewed' ? null : 'reviewed')}
                            className={`cursor-pointer bg-white p-6 rounded shadow-sm border-l-4 border-blue-600 transition-all
                                ${activeFilter === 'reviewed' ? 'ring-2 ring-blue-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="font-bold text-lg mb-2 text-blue-700 uppercase tracking-wide">Cases Reviewed</h3>
                            <p className="mt-2 text-4xl font-bold text-blue-600">{summary.reviewedCases}</p>
                            <p className="mt-1 text-xs text-gray-500">
                                {summary.totalCases > 0 ? ((summary.reviewedCases / summary.totalCases) * 100).toFixed(1) : 0}% of total
                            </p>
                        </div>

                        {/* Funds Risk */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'fundsRisk' ? null : 'fundsRisk')}
                            className={`cursor-pointer bg-white p-6 rounded shadow-sm border-l-4 border-orange-500 transition-all
                                ${activeFilter === 'fundsRisk' ? 'ring-2 ring-orange-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="font-bold text-lg mb-2 text-orange-700 uppercase tracking-wide">Funds Under Risk</h3>
                            <p className="mt-2 text-4xl font-bold text-orange-600">₹{(summary.fundsUnderRisk / 10000000).toFixed(2)} Cr</p>
                        </div>
                    </div>
                </div>

                {/* FILTERED DETAILED VIEW */}
                {activeFilter && (
                    <div className="mb-12 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#0b3c6f] border-b-2 border-gray-200 pb-1">
                                {activeFilter === 'all' && 'All Programs'}
                                {activeFilter === 'highRisk' && 'High Risk Programs'}
                                {activeFilter === 'reviewed' && 'Reviewed Programs'}
                                {activeFilter === 'fundsRisk' && 'Programs Contributing to Funds Risk'}
                                {activeFilter === 'validConcerns' && 'Valid Concerns (Confirmed Risks)'}
                                {activeFilter === 'falseAlarms' && 'False Alarms (Dismissed Risks)'}
                            </h2>
                            <button onClick={() => setActiveFilter(null)} className="text-sm text-gray-500 hover:text-red-600">
                                <i className="fas fa-times mr-1"></i> Close View
                            </button>
                        </div>

                        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                            {/* Reusing RiskTable - treating it as read-only or basic view */}
                            <RiskTable data={filteredReportData} />
                            <div className="p-2 text-center bg-gray-50 text-xs text-gray-500 border-t">
                                Showing {filteredReportData.length} records based on selection.
                            </div>
                        </div>
                    </div>
                )}


                {/* Review Metrics */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#0b3c6f] mb-4">Review Metrics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'validConcerns' ? null : 'validConcerns')}
                            className={`cursor-pointer bg-white border border-green-200 rounded p-6 shadow-sm transition-all
                                ${activeFilter === 'validConcerns' ? 'ring-2 ring-green-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Valid Concerns</h3>
                            <p className="mt-2 text-4xl font-bold text-green-600">{summary.validConcerns}</p>
                        </div>

                        <div
                            onClick={() => setActiveFilter(activeFilter === 'falseAlarms' ? null : 'falseAlarms')}
                            className={`cursor-pointer bg-white border border-gray-200 rounded p-6 shadow-sm transition-all
                                ${activeFilter === 'falseAlarms' ? 'ring-2 ring-gray-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">False Alarms</h3>
                            <p className="mt-2 text-4xl font-bold text-gray-600">{summary.falseAlarms}</p>
                        </div>

                        <div className="bg-white border border-purple-200 rounded p-6 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">False Positive Rate</h3>
                            <p className="mt-2 text-4xl font-bold text-purple-600">{summary.falsePositiveRate}%</p>
                            <p className="mt-1 text-xs text-gray-500">Lower is better</p>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="mb-12">
                    {/* ... Export buttons ... */}
                    <h2 className="text-xl font-bold text-[#0b3c6f] mb-4">Data Export</h2>
                    <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                        <p className="text-sm text-gray-600 mb-4">
                            Download datasets in CSV format for further analysis or reporting.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleExportAll}
                                className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                            >
                                Download Full Dataset
                            </button>
                            <button
                                onClick={handleExportHighRisk}
                                className="px-6 py-3 bg-red-600 text-white text-sm font-medium rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
                            >
                                Download High-Risk Cases Only
                            </button>
                            <button
                                onClick={handleExportAuditReport}
                                disabled={summary.reviewedCases === 0}
                                className={`px-6 py-3 text-sm font-medium rounded shadow focus:outline-none focus:ring-2 transition-colors duration-150 ${summary.reviewedCases === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                    }`}
                            >
                                Download Audit Report
                                {summary.reviewedCases === 0 && ' (No reviewed cases)'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mb-12">
                    {/* ... Disclamer ... */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> All statistics and exports reflect the current state of the dataset.
                            Ensure all high-risk cases have been reviewed before generating final audit reports.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
