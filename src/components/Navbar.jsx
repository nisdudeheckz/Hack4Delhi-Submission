import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState(16); // Default 16px

    // Handle Logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Handle Font Size
    const changeFontSize = (action) => {
        if (action === 'increase' && fontSize < 24) setFontSize(prev => prev + 2);
        if (action === 'decrease' && fontSize > 12) setFontSize(prev => prev - 2);
        if (action === 'reset') setFontSize(16);
    };

    // Apply font size to body
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    // Handle Skip to Main Content
    const skipToMain = () => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Default Links
    const navLinks = [
        { name: t('navHome'), path: '/dashboard', icon: 'fas fa-home' },
        { name: t('navAlerts'), path: '/alerts', icon: '' },
        { name: t('navReports'), path: '/reports', icon: '' },
    ];

    // Real Links (previously placeholders)
    const extraLinks = [
        { name: t('navDepts'), path: '/departments' },
        { name: t('navNotice'), path: '/notices' },
        { name: t('navRTI'), path: '/rti' },
        { name: t('navContact'), path: '/contact' }
    ];

    return (
        <div className="w-full font-sans">
            {/* 1. Top Strip (Accessibility & Utility) */}
            <div className="bg-[#0b1e3c] text-white text-xs py-1 px-4 sm:px-8 flex flex-wrap justify-end items-center gap-4">
                <div className="flex items-center gap-2 border-r border-gray-500 pr-3">
                    <button onClick={skipToMain} className="hover:text-yellow-400 font-bold focus:outline-yellow-400">{t('skipToMain')}</button>
                    <span className="text-gray-400">|</span>
                    <button className="hover:text-yellow-400"><i className="fas fa-wheelchair"></i> {t('screenReader')}</button>
                </div>
                <div className="flex items-center gap-2 border-r border-gray-500 pr-3">
                    <button onClick={() => changeFontSize('decrease')} className="hover:text-yellow-400 text-[10px] font-bold" title="Decrease Font">A-</button>
                    <button onClick={() => changeFontSize('reset')} className="hover:text-yellow-400 text-xs font-bold" title="Reset Font">A</button>
                    <button onClick={() => changeFontSize('increase')} className="hover:text-yellow-400 text-sm font-bold" title="Increase Font">A+</button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLogout}
                        className="bg-yellow-500 text-black px-3 py-0.5 rounded-sm font-bold hover:bg-yellow-400 transition-colors"
                    >
                        {t('logout')}
                    </button>
                    <select
                        value={language}
                        onChange={(e) => toggleLanguage(e.target.value)}
                        className="bg-[#0b1e3c] border border-gray-500 rounded-sm py-0.5 px-1 focus:outline-none"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                    </select>
                </div>
            </div>

            {/* 2. Main Header (Logos & Branding) */}
            <div className="bg-white py-2 px-4 sm:px-8 border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png"
                            alt="Emblem"
                            className="h-12 sm:h-16 object-contain"
                        />
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                                {t('appTitle')}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                                {t('govtTitle')}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-center group cursor-pointer">
                            <div className="h-12 w-24 bg-white flex items-center justify-center border border-gray-200 rounded shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3KvIDJaZXcLi0Xf7WZICZPhxdrNwaSZtPtw&s" alt="G20" className="h-full object-contain" />
                            </div>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="h-12 w-24 bg-white flex items-center justify-center border border-gray-200 rounded shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                                <img src="https://media.istockphoto.com/id/1607483797/vector/banner-or-header-designed-of-15th-august-happy-independence-day-of-india.jpg?s=612x612&w=0&k=20&c=tS_9ghoRvgcIEbSi-mn3qwDq1phL1dfObM8rI9BH6t8=" alt="Azadi" className="h-full object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Navigation Bar (Blue Menu) */}
            <nav className="bg-[#004b8d] text-white shadow-md sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
                    <div className="flex items-center space-x-0 overflow-x-auto custom-scrollbar">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-4 hover:bg-[#003d73] transition-colors ${isActive ? 'border-yellow-400 bg-[#003d73]' : 'border-transparent'
                                    }`
                                }
                            >
                                {link.icon && <i className={`${link.icon} mr-2`}></i>}
                                {link.name}
                            </NavLink>
                        ))}

                        {/* Real Pages (Departments, Notices, etc.) */}
                        {extraLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-4 hover:bg-[#003d73] transition-colors ${isActive ? 'border-yellow-400 bg-[#003d73]' : 'border-transparent'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* Search Icon pushed to right */}
                        <div className="flex-1 flex justify-end py-2 min-w-[200px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="pl-3 pr-8 py-1 rounded-full text-black text-sm w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    dir={language === 'Hindi' ? 'rtl' : 'ltr'} // Just an example, Hindi is LTR but keeping logic
                                />
                                <button className="absolute right-0 top-0 bottom-0 px-2.5 bg-yellow-500 rounded-r-full text-[#004b8d] hover:bg-yellow-600 transition-colors">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
