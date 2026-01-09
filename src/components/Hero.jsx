import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { filters } = useData();
    const { t } = useLanguage();
    const scrollToRef = useRef(null);

    // Mock "Admin Activities" to show to the Auditor
    // In a real app, this would come from a websocket/database of admin actions
    const systemAlerts = [
        "Admin: Updated risk thresholds for PM-KISAN scheme.",
        "System: New dataset 'Q3_Spending.csv' uploaded successfully.",
        "Admin: Reviewed flagged vendor 'TechCorp Solutions'.",
        "System: Maintenance scheduled for 12:00 AM."
    ];

    return (
        <div className="w-full bg-white font-sans">
            {/* 1. Yellow Ticker - Replaces "Latest News" with "System Alerts" */}
            <div className="bg-yellow-400 text-black py-2 px-4 flex items-center shadow-sm relative z-10">
                <span className="bg-[#cc0000] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mr-4 shadow-sm rounded-sm whitespace-nowrap">
                    {t('tickerLabel')}
                </span>
                <div className="overflow-hidden flex-1 relative h-6">
                    <div className="animate-marquee whitespace-nowrap absolute top-0">
                        {systemAlerts.map((alert, index) => (
                            <span key={index} className="mx-8 text-sm font-medium text-gray-900">
                                <i className="fas fa-bell text-gray-700 mr-2"></i>
                                {alert}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 ml-4 border-l border-gray-400 pl-4">
                    <button className="text-gray-800 hover:text-black"><i className="fas fa-chevron-left"></i></button>
                    <button className="text-gray-800 hover:text-black"><i className="fas fa-pause"></i></button>
                    <button className="text-gray-800 hover:text-black"><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>

            {/* 2. Banner Section (Government Style) */}
            <div className="relative w-full h-[400px] bg-gray-200 overflow-hidden">
                {/* Using a placeholder government-style banner image */}
                <img
                    src="https://t4.ftcdn.net/jpg/04/09/50/27/360_F_409502739_pv2Lehr8cOUqSWE1nvWmdqC8u2RQc9PH.jpg"
                    alt="Delhi Government Banner"
                    className="w-full h-full object-cover"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-8 sm:px-16">
                    <div className="max-w-2xl text-white">
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
                            {t('heroTitle')}
                        </h2>
                        <p className="text-lg md:text-xl mb-8 font-light drop-shadow text-gray-100 border-l-4 border-yellow-400 pl-4">
                            {t('heroDesc')}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-sm shadow-lg transition-transform transform hover:-translate-y-1 flex items-center"
                            >
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                {t('heroViewBtn')}
                            </button>
                            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-[#0b1e3c] text-white font-bold py-3 px-6 rounded-sm shadow-lg transition-all flex items-center">
                                <i className="fas fa-file-download mr-2"></i>
                                {t('heroDownloadBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
