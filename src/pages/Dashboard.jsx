import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import SummaryCards from '../components/SummaryCards';
import Filters from '../components/Filters';
import RiskTable from '../components/RiskTable';
import ExplainPanel from '../components/ExplainPanel';
import SearchBar from '../components/SearchBar';
import DataUpload from '../components/DataUpload';
import RiskThresholdControl from '../components/RiskThresholdControl';
import Sidebar from '../components/Sidebar'; // Imported new component
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const { enrichedData, riskThreshold, isLoading } = useData();
    const { user } = useAuth();
    const { t } = useLanguage();

    const isAuditor = user?.role === 'auditor';
    const isAdmin = user?.role === 'admin';

    // Local state for UI
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filters, setFilters] = useState({
        state: 'All States',
        department: 'All Departments',
        scheme: 'All Schemes',
        riskLevel: 'All Risk Levels'
    });

    // Filter logic
    const filteredData = useMemo(() => {
        if (!enrichedData) return [];

        return enrichedData.filter(item => {
            const matchesState = filters.state === 'All States' || item.state === filters.state;
            const matchesDept = filters.department === 'All Departments' || item.department === filters.department;
            const matchesScheme = filters.scheme === 'All Schemes' || item.scheme === filters.scheme;

            let matchesRisk = true;
            if (filters.riskLevel !== 'All Risk Levels') {
                matchesRisk = item.riskLevel === filters.riskLevel;
            }

            return matchesState && matchesDept && matchesScheme && matchesRisk;
        });
    }, [enrichedData, filters]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading secure dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section with Ticker */}
            <Hero />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Column (Left - 3/4 width) */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* 1. Summary Cards (New Blue Design) */}
                        <SummaryCards data={filteredData} />

                        {/* 2. Controls Section */}
                        <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#0b3c6f]">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                <h2 className="text-xl font-bold text-[#0b3c6f] uppercase border-b-2 border-yellow-400 pb-1">
                                    {isAdmin ? t('systemControl') : t('auditFilters')}
                                </h2>
                                <SearchBar />
                            </div>
                            <Filters data={enrichedData} filters={filters} setFilters={setFilters} />

                            {/* ADMIN ONLY: Risk Threshold Control */}
                            {isAdmin && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <RiskThresholdControl />
                                </div>
                            )}
                        </div>

                        {/* 3. Upload Section - ADMIN ONLY */}
                        {isAdmin && (
                            <div className="space-y-8">
                                {/* Escalations Review Queue */}
                                <div className="bg-red-50 p-6 rounded shadow-sm border-l-4 border-red-600">
                                    <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-2"></i> Escalations Pending Review
                                    </h3>
                                    {enrichedData.filter(d => d.auditStatus === 'Escalated').length === 0 ? (
                                        <p className="text-gray-600 italic">No cases currently escalated for review.</p>
                                    ) : (
                                        <RiskTable
                                            data={enrichedData.filter(d => d.auditStatus === 'Escalated')}
                                            onRowClick={setSelectedRecord}
                                        />
                                    )}
                                </div>

                                <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#0b3c6f]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-[#0b3c6f]"><i className="fas fa-cloud-upload-alt mr-2"></i> {t('ingestData')}</h3>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('adminPrivilege')}</span>
                                    </div>
                                    <DataUpload />
                                </div>
                            </div>
                        )}

                        {/* AUDITOR ONLY: Pending Tasks Welcome */}
                        {isAuditor && (
                            <div className="bg-blue-50 p-6 rounded shadow-sm border-l-4 border-[#0b3c6f] flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[#0b3c6f] mb-1">{t('welcomeAuditor')}</h3>
                                    <p className="text-sm text-gray-600">{t('pendingReview')}</p>
                                </div>
                                <button
                                    onClick={() => document.getElementById('risk-table-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-[#0b3c6f] text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-blue-800"
                                >
                                    {t('startReview')}
                                </button>
                            </div>
                        )}

                        {/* 4. Main Data Table */}
                        <div id="risk-table-section" className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#0b3c6f]">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-[#0b3c6f]">
                                    <i className="fas fa-list mr-2"></i> {isAuditor ? 'My Assigned Cases' : 'Global Transaction Monitor'}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    Threshold: {riskThreshold} | Role: <span className="uppercase font-bold">{user?.role}</span>
                                </span>
                            </div>

                            {/* Logic: Admins see all filtered data. Auditors see ONLY assigned (High Risk) data */}
                            <RiskTable
                                data={isAuditor ? filteredData.filter(d => d.riskScore >= riskThreshold) : filteredData}
                                onRowClick={setSelectedRecord}
                            />
                        </div>

                    </div>

                    {/* Sidebar Column (Right - 1/4 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        <Sidebar isAdmin={isAdmin} isAuditor={isAuditor} />
                    </div>

                </div>

            </main>

            {/* Explainability Panel (Overlay) */}
            {selectedRecord && (
                <ExplainPanel
                    record={selectedRecord}
                    riskData={{
                        score: selectedRecord.riskScore,
                        reasons: selectedRecord.riskReasons || []
                    }}
                    onClose={() => setSelectedRecord(null)}
                />
            )}

        </div>
    );
};

export default Dashboard;
