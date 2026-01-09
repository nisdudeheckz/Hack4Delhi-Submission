import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const SummaryCards = ({ data }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (!data) return null;

    // Calculate metrics
    const highRiskCount = data.filter(record => record.riskScore > 75).length;

    const fundsUnderRisk = data
        .filter(record => record.riskScore > 75)
        .reduce((sum, record) => sum + record.amountDisbursed, 0);

    const departmentsUnderWatch = new Set(
        data
            .filter(record => record.riskScore > 75)
            .map(record => record.department)
    ).size;

    const formatCurrency = (amount) => {
        const crores = amount / 10000000;
        return `₹${crores.toFixed(2)} Cr`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Blue Card 1: High Risk Entities -> Go to Alerts */}
            <div
                onClick={() => navigate('/alerts')}
                className="bg-[#0b3c6f] text-white p-6 rounded shadow-md relative overflow-hidden group hover:bg-[#003d73] transition-all border-b-4 border-yellow-400 cursor-pointer"
                title="Click to view detailed Alerts"
            >
                <div className="absolute right-[-20px] top-[-20px] text-white/10 text-9xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-exclamation-circle"></i>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 text-4xl text-yellow-400">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{t('cardHighRisk')}</h3>
                    <p className="text-4xl font-extrabold text-white mb-2">{highRiskCount}</p>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        {t('cardImmediateAction')}
                    </span>
                </div>
            </div>

            {/* Blue Card 2: Funds Under Risk -> Go to Reports */}
            <div
                onClick={() => navigate('/reports')}
                className="bg-[#0b3c6f] text-white p-6 rounded shadow-md relative overflow-hidden group hover:bg-[#003d73] transition-all border-b-4 border-yellow-400 cursor-pointer"
                title="Click to view full Audit Reports"
            >
                <div className="absolute right-[-20px] top-[-20px] text-white/10 text-9xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 text-4xl text-yellow-400">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{t('cardFundsRisk')}</h3>
                    <p className="text-4xl font-extrabold text-white mb-2">{formatCurrency(fundsUnderRisk)}</p>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        {t('cardFlaggedTrans')}
                    </span>
                </div>
            </div>

            {/* Blue Card 3: Departments Under Watch -> Go to Departments (or Reports) */}
            <div
                onClick={() => navigate('/departments')}
                className="bg-[#0b3c6f] text-white p-6 rounded shadow-md relative overflow-hidden group hover:bg-[#003d73] transition-all border-b-4 border-yellow-400 cursor-pointer"
                title="Click to view Department details"
            >
                <div className="absolute right-[-20px] top-[-20px] text-white/10 text-9xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-building"></i>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 text-4xl text-yellow-400">
                        <i className="fas fa-university"></i>
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{t('cardDepartments')}</h3>
                    <p className="text-4xl font-extrabold text-white mb-2">{departmentsUnderWatch}</p>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        {t('cardUnderScrutiny')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
