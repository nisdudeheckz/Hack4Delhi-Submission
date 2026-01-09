import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import RiskTable from '../components/RiskTable';
import ExplainPanel from '../components/ExplainPanel';

const Alerts = () => {
    const { enrichedData, riskThreshold } = useData();
    const [activeFilter, setActiveFilter] = useState(null); // 'critical', 'high', 'medium', 'low'
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Filter logic based on active filter
    const filteredAlerts = useMemo(() => {
        let baseData = enrichedData.sort((a, b) => b.riskScore - a.riskScore);

        if (!activeFilter) return baseData.filter(d => d.riskScore > 80); // Default to Critical only if no filter (or keep all?) 
        // actually, let's make default view show critical, similar to before.

        switch (activeFilter) {
            case 'critical':
                return baseData.filter(d => d.riskScore > 80);
            case 'high':
                return baseData.filter(d => d.riskScore > 60 && d.riskScore <= 80);
            case 'medium':
                return baseData.filter(d => d.riskScore > 40 && d.riskScore <= 60);
            case 'low':
                return baseData.filter(d => d.riskScore <= 40);
            case 'all':
                return baseData;
            default:
                return baseData.filter(d => d.riskScore > 80);
        }
    }, [enrichedData, activeFilter]);

    // Counts for cards
    const counts = useMemo(() => {
        return {
            critical: enrichedData.filter(d => d.riskScore > 80).length,
            high: enrichedData.filter(d => d.riskScore > 60 && d.riskScore <= 80).length,
            medium: enrichedData.filter(d => d.riskScore > 40 && d.riskScore <= 60).length,
            low: enrichedData.filter(d => d.riskScore <= 40).length
        };
    }, [enrichedData]);


    const handleRowClick = (record) => {
        setSelectedRecord(record);
    };

    const handleClosePanel = () => {
        setSelectedRecord(null);
    };

    return (
        <div className="w-full">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
                    System Alerts & Notifications
                </h1>

                <p className="text-sm text-gray-600 mb-6">
                    Click on a priority level to view corresponding cases.
                </p>

                {/* Alert Summary Cards - Interactive */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        {/* Critical */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'critical' ? null : 'critical')}
                            className={`cursor-pointer bg-white border-l-4 border-red-600 rounded p-4 shadow-sm transition-all
                                ${activeFilter === 'critical' ? 'ring-2 ring-red-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Critical ({'>'}80)</h3>
                            <p className="mt-2 text-3xl font-bold text-red-600">{counts.critical}</p>
                        </div>

                        {/* High */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'high' ? null : 'high')}
                            className={`cursor-pointer bg-white border-l-4 border-orange-500 rounded p-4 shadow-sm transition-all
                                ${activeFilter === 'high' ? 'ring-2 ring-orange-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide">High (60-80)</h3>
                            <p className="mt-2 text-3xl font-bold text-orange-600">{counts.high}</p>
                        </div>

                        {/* Medium */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'medium' ? null : 'medium')}
                            className={`cursor-pointer bg-white border-l-4 border-yellow-500 rounded p-4 shadow-sm transition-all
                                ${activeFilter === 'medium' ? 'ring-2 ring-yellow-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Medium (40-60)</h3>
                            <p className="mt-2 text-3xl font-bold text-yellow-600">{counts.medium}</p>
                        </div>

                        {/* Low */}
                        <div
                            onClick={() => setActiveFilter(activeFilter === 'low' ? null : 'low')}
                            className={`cursor-pointer bg-white border-l-4 border-green-500 rounded p-4 shadow-sm transition-all
                                ${activeFilter === 'low' ? 'ring-2 ring-green-400 shadow-md transform scale-105' : 'hover:shadow-md'}
                            `}
                        >
                            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Low ({'<'}40)</h3>
                            <p className="mt-2 text-3xl font-bold text-green-600">{counts.low}</p>
                        </div>
                    </div>
                </div>

                {/* Filtered Table View */}
                <div className="mb-8 animate-fade-in">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#0b3c6f]">
                            {activeFilter === 'critical' && 'Critical Risk Cases'}
                            {activeFilter === 'high' && 'High Priority Cases'}
                            {activeFilter === 'medium' && 'Medium Priority Cases'}
                            {activeFilter === 'low' && 'Low Priority Cases'}
                            {!activeFilter && 'Critical Risk Cases (Default)'}
                        </h2>
                        {activeFilter && (
                            <button onClick={() => setActiveFilter(null)} className="text-sm text-gray-500 hover:text-red-600">
                                <i className="fas fa-times mr-1"></i> Clear Filter (Show Critical)
                            </button>
                        )}
                    </div>
                    <RiskTable data={filteredAlerts} onRowClick={handleRowClick} />
                </div>

                {selectedRecord && (
                    <ExplainPanel
                        record={selectedRecord}
                        riskData={{
                            score: selectedRecord.riskScore,
                            reasons: selectedRecord.riskReasons
                        }}
                        onClose={handleClosePanel}
                    />
                )}
            </div>
        </div>
    );
};

export default Alerts;
