import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ isAdmin, isAuditor }) => {
    const { t } = useLanguage();
    const [activeSidebarTab, setActiveSidebarTab] = useState('notifications');

    // Mock function for "View PDF" interaction
    const openMockPdf = (title) => {
        alert(`[MOCK] Opening official document: ${title}\n(In production, this opens a PDF viewer)`);
    };

    const openRealLink = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">

            {/* Profile Card 1 */}
            <div className="bg-white rounded shadow-sm p-6 flex flex-col items-center text-center border-t-4 border-yellow-400">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-gray-300">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6t7MtUtWi4nWkbjJ5rIrSzCEje2nnRKcuAg&s" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-[#0b3c6f]">{t('lgName')}</h4>
                <p className="text-xs text-gray-500 font-semibold uppercase">{t('lgTitle')}</p>
            </div>

            {/* Profile Card 2 */}
            <div className="bg-white rounded shadow-sm p-6 flex flex-col items-center text-center border-t-4 border-yellow-400">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-gray-300">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZdbroZmOcIRNzzoVJL5WZcN3NLNk3G5vBIg&s" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-[#0b3c6f]">Smt. Rekha Gupta</h4>
                <p className="text-xs text-gray-500 font-semibold uppercase">{t('cmTitle')}</p>
            </div>

            {/* Notifications / Tenders Tab */}
            <div className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-[#0b3c6f]">
                <div className="flex text-sm font-bold bg-gray-100">
                    <button
                        onClick={() => setActiveSidebarTab('notifications')}
                        className={`flex-1 py-3 border-b-2 text-[#0b3c6f] ${activeSidebarTab === 'notifications' ? 'border-[#0b3c6f] bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        {t('tabNotifications')}
                    </button>
                    <button
                        onClick={() => setActiveSidebarTab('tenders')}
                        className={`flex-1 py-3 border-b-2 text-[#0b3c6f] ${activeSidebarTab === 'tenders' ? 'border-[#0b3c6f] bg-white' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        {t('tabTenders')}
                    </button>
                </div>

                <div className="p-0 h-64 overflow-y-auto custom-scrollbar">
                    {/* Content Logic */}
                    {activeSidebarTab === 'notifications' ? (
                        isAdmin ? (
                            // Admin Notifications
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <p className="text-xs text-[#0b3c6f] font-semibold mb-1">System Audit Log #{1000 + i}</p>
                                    <p className="text-[10px] text-gray-500">Auditor-1 flagged {i * 2} cases.</p>
                                    <button onClick={() => openMockPdf(`Log #${1000 + i}`)} className="text-[10px] text-blue-600 mt-2 hover:underline">View Log</button>
                                </div>
                            ))
                        ) : (
                            // Auditor Notifications
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <p className="text-xs text-[#0b3c6f] font-semibold mb-1">New Audit Guideline #{100 + i}</p>
                                    <p className="text-[10px] text-gray-500">Released by Finance Dept.</p>
                                    <button onClick={() => openMockPdf(`Guideline #${100 + i}`)} className="text-[10px] text-blue-600 mt-2 hover:underline">View PDF <i className="fas fa-file-pdf ml-1"></i></button>
                                </div>
                            ))
                        )
                    ) : (
                        // Tenders Content
                        [1, 2, 3].map(i => (
                            <div key={i} className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                <p className="text-xs text-[#0b3c6f] font-semibold mb-1">Tender No. DL/{2026 + i}/XYZ</p>
                                <p className="text-[10px] text-gray-500">Subject: Annual IT Maintenance</p>
                                <p className="text-[10px] text-red-600 font-bold">Closing Date: {10 + i} Jan 2026</p>
                                <button onClick={() => openMockPdf(`Tender DL/${2026 + i}`)} className="text-[10px] text-blue-600 mt-2 hover:underline">Download NIT <i className="fas fa-download ml-1"></i></button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-2 bg-yellow-400 text-center">
                    <button
                        onClick={() => openMockPdf(activeSidebarTab === 'notifications' ? 'All Notifications' : 'Archived Tenders')}
                        className="text-xs font-bold text-[#0b3c6f]"
                    >
                        {t('viewAll')}
                    </button>
                </div>
            </div>

            {/* Quick Links Sidebar */}
            <div className="bg-[#0b3c6f] text-white rounded shadow-sm p-4">
                <h4 className="font-bold mb-4 border-b border-blue-400 pb-2">{t('importantLinks')}</h4>
                <ul className="space-y-2 text-sm">
                    <li><button onClick={() => openRealLink('https://cag.gov.in')} className="hover:text-yellow-400 block py-1 border-b border-blue-800 text-left w-full"><i className="fas fa-angle-right mr-2"></i> CAG Audit Reports</button></li>
                    <li><button onClick={() => openRealLink('https://finance.delhi.gov.in/sites/default/files/Finance/generic_multiple_files/budget_at_a_glance_2025-26.pdf')} className="hover:text-yellow-400 block py-1 border-b border-blue-800 text-left w-full"><i className="fas fa-angle-right mr-2"></i> Delhi Budget 2025-26</button></li>
                    <li><button onClick={() => openRealLink('https://selfservice.gstsystem.in')} className="hover:text-yellow-400 block py-1 border-b border-blue-800 text-left w-full"><i className="fas fa-angle-right mr-2"></i> GST Portal</button></li>
                    <li><button onClick={() => openRealLink('https://eprocure.gov.in/cppp/')} className="hover:text-yellow-400 block py-1 border-b border-blue-800 text-left w-full"><i className="fas fa-angle-right mr-2"></i> e-Procurement</button></li>
                </ul>
            </div>

        </div>
    );
};

export default Sidebar;
