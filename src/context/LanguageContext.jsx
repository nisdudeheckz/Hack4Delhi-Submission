import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('English');

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    const translations = {
        English: {
            // Header
            govtTitle: "Government of National Capital Territory of Delhi",
            appTitle: "Public Expenditure Risk Monitor (AI)",
            skipToMain: "Skip to Main Content",
            screenReader: "Screen Reader Access",
            logout: "Logout",
            searchPlaceholder: "Search",

            // Navbar
            navHome: "Home",
            navAlerts: "Critical Alerts",
            navReports: "Audit Reports",
            navDepts: "Departments/Offices",
            navNotice: "Notice Board",
            navRTI: "RTI",
            navContact: "Contact Us",

            // Hero
            heroTitle: "Ensuring Transparency in Public Expenditure",
            heroDesc: "Advanced AI-driven monitoring system to detect financial anomalies, prevent fraud, and ensure efficient utilization of public funds.",
            heroViewBtn: "View High Risk Cases",
            heroDownloadBtn: "Download Audit Summary",
            tickerLabel: "LIVE SYSTEM ALERTS",

            // Summary Cards
            cardHighRisk: "High Risk Entities",
            cardFundsRisk: "Funds At Risk",
            cardDepartments: "Departments",
            cardImmediateAction: "Immediate Action Required",
            cardFlaggedTrans: "Flagged Transactions",
            cardUnderScrutiny: "Under Scrutiny",

            // Dashboard Controls
            welcomeAuditor: "Welcome, Auditor",
            startReview: "Start Review Session",
            pendingReview: "You have qualified transactions pending review.",
            auditFilters: "Audit Filters",
            systemControl: "System Control & Filters",
            ingestData: "Ingest New Expenditure Data",
            adminPrivilege: "Admin Privilege",

            // Table Headers
            colId: "Transaction ID",
            colEntity: "Beneficiary / Entity",
            colScheme: "Scheme Name",
            colAmount: "Amount",
            colRiskScore: "Risk Score",
            colStatus: "Status",
            colAction: "Action",
            liveData: "Live Data",
            flaggedTrans: "Flagged Transactions",

            // Sidebar
            lgName: "Shri Vinai Kumar Saxena",
            lgTitle: "Lieutenant Governor",
            cmTitle: "Chief Minister, Delhi",
            tabNotifications: "Notifications",
            tabTenders: "Tenders",
            importantLinks: "Important Links",
            viewAll: "View All"
        },
        Hindi: {
            // Header
            govtTitle: "राष्ट्रीय राजधानी क्षेत्र दिल्ली सरकार",
            appTitle: "सार्वजनिक व्यय जोखिम निगरानी (एआई)",
            skipToMain: "मुख्य सामग्री पर जाएं",
            screenReader: "स्क्रीन रीडर एक्सेस",
            logout: "लॉग आउट",
            searchPlaceholder: "खोजें",

            // Navbar
            navHome: "मुख्य पृष्ठ",
            navAlerts: "महत्वपूर्ण अलर्ट",
            navReports: "ऑडिट रिपोर्ट",
            navDepts: "विभाग / कार्यालय",
            navNotice: "सूचना पट्ट",
            navRTI: "आर.टी.आई",
            navContact: "संपर्क करें",

            // Hero
            heroTitle: "सार्वजनिक व्यय में पारदर्शिता सुनिश्चित करना",
            heroDesc: "वित्तीय अनियमितताओं का पता लगाने, धोखाधड़ी को रोकने और सार्वजनिक धन का कुशल उपयोग सुनिश्चित करने के लिए उन्नत एआई-संचालित निगरानी प्रणाली।",
            heroViewBtn: "उच्च जोखिम मामले देखें",
            heroDownloadBtn: "ऑडिट सारांश डाउनलोड करें",
            tickerLabel: "लाइव सिस्टम अलर्ट",

            // Summary Cards
            cardHighRisk: "उच्च जोखिम संस्थाएं",
            cardFundsRisk: "जोखिम में धनराशि",
            cardDepartments: "विभाग",
            cardImmediateAction: "तत्काल कार्रवाई आवश्यक",
            cardFlaggedTrans: "चिन्हित लेनदेन",
            cardUnderScrutiny: "जांच के दायरे में",

            // Dashboard Controls
            welcomeAuditor: "स्वागत है, ऑडिटर",
            startReview: "समीक्षा सत्र शुरू करें",
            pendingReview: "आपके पास समीक्षा के लिए योग्य लेनदेन लंबित हैं।",
            auditFilters: "ऑडिट फिल्टर",
            systemControl: "सिस्टम नियंत्रण और फिल्टर",
            ingestData: "नया व्यय डेटा अपलोड करें",
            adminPrivilege: "एडमिन विशेषाधिकार",

            // Table Headers
            colId: "लेनदेन आईडी",
            colEntity: "लाभार्थी / संस्था",
            colScheme: "योजना का नाम",
            colAmount: "राशि",
            colRiskScore: "जोखिम स्कोर",
            colStatus: "स्थिति",
            colAction: "कार्रवाई",
            liveData: "लाइव डेटा",
            flaggedTrans: "चिन्हित लेनदेन",

            // Sidebar
            lgName: "श्री विनय कुमार सक्सेना",
            lgTitle: "उपराज्यपाल",
            cmTitle: "मुख्यमंत्री, दिल्ली",
            tabNotifications: "सूचनाएं",
            tabTenders: "निविदाएं",
            importantLinks: "महत्वपूर्ण लिंक",
            viewAll: "सभी देखें"
        }
    };

    // Helper to get text safely
    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
