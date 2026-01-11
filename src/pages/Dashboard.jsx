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
    const { enrichedData, riskThreshold, isLoading, resetData } = useData();
    const { user } = useAuth();
    const { t } = useLanguage();

    const isAuditor = user?.role === 'auditor';
    const isAdvisor = user?.role === 'senior_advisor';
    const isAdmin = user?.role === 'admin';

    // Local state for UI
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
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
            // Role-based visibility restriction: Senior Advisors only see escalated cases
            if (isAdvisor && item.auditStatus !== 'Escalated') return false;

            const matchesState = filters.state === 'All States' || item.state === filters.state;
            const matchesDept = filters.department === 'All Departments' || item.department === filters.department;
            const matchesScheme = filters.scheme === 'All Schemes' || item.scheme === filters.scheme;

            let matchesRisk = true;
            if (filters.riskLevel === 'High') {
                matchesRisk = item.riskScore >= riskThreshold;
            } else if (filters.riskLevel === 'Medium') {
                matchesRisk = item.riskScore >= 50 && item.riskScore < riskThreshold;
            } else if (filters.riskLevel === 'Low') {
                matchesRisk = item.riskScore < 50;
            }

            let matchesSearch = true;
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                matchesSearch =
                    item.id.toString().includes(lowerQuery) ||
                    item.vendorName.toLowerCase().includes(lowerQuery) ||
                    item.department.toLowerCase().includes(lowerQuery) ||
                    item.scheme.toLowerCase().includes(lowerQuery) ||
                    item.flagReason.toLowerCase().includes(lowerQuery) ||
                    item.state.toLowerCase().includes(lowerQuery) ||
                    item.district.toLowerCase().includes(lowerQuery);
            }

            return matchesState && matchesDept && matchesScheme && matchesRisk && matchesSearch;
        });

    }, [enrichedData, filters, riskThreshold, searchQuery, isAdvisor]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading secure dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section with Ticker */}
            <Hero />

            <main className="w-full px-4 sm:px-8 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Column (Left - 3/4 width) */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* 1. Summary Cards (New Blue Design) */}
                        <SummaryCards data={filteredData} />

                        {/* 2. Controls Section - Moved below */}

                        {/* 3. Upload Section & Escalations */}
                        {(isAdmin || isAdvisor) && (
                            <div className="space-y-8">
                                {/* Escalations Review Queue - Visible to Admin & Advisor */}
                                <div className="bg-red-50 p-6 rounded shadow-sm border-l-4 border-red-600">
                                    <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-2"></i> {isAdvisor ? 'Escalations Pending Re-Audit' : 'Escalations Overview'}
                                    </h3>
                                    {enrichedData.filter(d => d.auditStatus === 'Escalated').length === 0 ? (
                                        <p className="text-gray-600 italic">No cases currently escalated for review.</p>
                                    ) : (
                                        <RiskTable
                                            data={enrichedData.filter(d => d.auditStatus === 'Escalated')}
                                            onRowClick={setSelectedRecord}
                                            riskThreshold={riskThreshold}
                                        />
                                    )}
                                </div>

                                {/* AI Audit Assistant Entry - NEW (Admin Only) */}
                                {isAdmin && (
                                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded shadow-lg border border-gray-700 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                            <img src="https://cdn-icons-png.flaticon.com/256/14657/14657058.png" alt="PRAGATI-AI" className="w-40 h-40" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                                <i className="fas fa-project-diagram text-yellow-400"></i> PRAGATI-AI Audit Assistant
                                            </h3>
                                            <p className="text-gray-300 text-sm mb-4 max-w-md">
                                                Launch PRAGATI-AI autonomous agent to scan 16-year archives (2010-2026), detect anomalies, and generate intelligence reports.
                                            </p>
                                            <button
                                                onClick={() => window.location.href = '/ai-monitor'}
                                                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <i className="fas fa-rocket"></i> Launch Monitor
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Upload - Admin Only */}
                                {isAdmin && (
                                    <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#0b3c6f]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-[#0b3c6f]"><i className="fas fa-cloud-upload-alt mr-2"></i> {t('ingestData')}</h3>
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('adminPrivilege')}</span>
                                        </div>
                                        <DataUpload />

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                            <button
                                                onClick={resetData}
                                                className="text-xs text-red-600 hover:text-red-800 underline flex items-center"
                                            >
                                                <i className="fas fa-trash-alt mr-1"></i> Reset System Data
                                            </button>
                                        </div>
                                    </div>
                                )}
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

                        {/* 2. Controls Section (Moved Here) */}
                        <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#0b3c6f] mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                <h2 className="text-xl font-bold text-[#0b3c6f] uppercase border-b-2 border-yellow-400 pb-1">
                                    {isAdmin ? t('systemControl') : t('auditFilters')}
                                </h2>
                                <SearchBar onSearch={setSearchQuery} />
                            </div>
                            <Filters data={enrichedData} filters={filters} setFilters={setFilters} />

                            {/* ADMIN ONLY: Risk Threshold Control */}
                            {isAdmin && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <RiskThresholdControl />
                                </div>
                            )}
                        </div>

                        {/* 4. Main Data Table */}
                        <div id="risk-table-section" className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#0b3c6f]">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                {/* Dynamic Header based on Role */}
                                <h3 className="font-bold text-[#0b3c6f]">
                                    <i className="fas fa-list mr-2"></i>
                                    {isAuditor ? 'My Assigned Cases' : isAdvisor ? 'Assigned Escalations (Review Only)' : 'Global Transaction Monitor'}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    Threshold: {riskThreshold} | Role: <span className="uppercase font-bold">{user?.role === 'senior_advisor' ? 'Sr. Advisor' : user?.role}</span>
                                </span>
                            </div>

                            {/* Logic: Admins see all filtered data. Auditors see ONLY assigned (High Risk) data */}
                            <RiskTable
                                data={isAuditor ? filteredData.filter(d => d.auditStatus !== 'Escalated') : filteredData}
                                onRowClick={setSelectedRecord}
                                riskThreshold={riskThreshold}
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
