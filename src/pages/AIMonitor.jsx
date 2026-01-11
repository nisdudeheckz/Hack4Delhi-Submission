import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { upcomingAudits, predictiveRiskAreas, auditCalendarSummary } from '../data/upcomingAudits';



function AIMonitor() {
    const { performAIScan, aiScanResults, importAiFindings } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0); // For visualizing progress
    const [isChatMinimized, setIsChatMinimized] = useState(false); // Chat minimize state
    const [filters, setFilters] = useState({
        year: 'All Years',
        source: 'All Sources',
        state: 'All States',
        department: 'All Departments'
    });

    const YEARS = Array.from({ length: 17 }, (_, i) => (2010 + i).toString()); // 2010-2026


    // Dynamic filters based on actual scan results
    const availableSources = useMemo(() => {
        if (aiScanResults.length === 0) return ['CAG Report', 'Ministry Audit', 'RTI Disclosure', 'News Media'];
        const sources = [...new Set(aiScanResults.map(item => item.sourceType))];
        return sources.sort();
    }, [aiScanResults]);

    const availableDepartments = useMemo(() => {
        if (aiScanResults.length === 0) return [
            "Rural Works Department", "Ministry of Railways", "Industrial Development Corp",
            "Dept of Health & Family Welfare", "Urban Development", "Public Works Department",
            "Education Department", "Water Resources"
        ];
        const departments = [...new Set(aiScanResults.map(item => item.department))];
        return departments.sort();
    }, [aiScanResults]);

    const availableStates = useMemo(() => {
        if (aiScanResults.length === 0) return [
            "Bihar", "Delhi", "Goa", "Odisha", "Uttar Pradesh", "Maharashtra",
            "Karnataka", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan", "Madhya Pradesh"
        ];
        const states = [...new Set(aiScanResults.map(item => item.state))];
        return states.sort();
    }, [aiScanResults]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [chatMessages, setChatMessages] = useState([
        {
            sender: 'agent',
            text: `👋 Hello ${user?.name || 'Admin'}! I'm your AI Audit Intelligence Assistant.\n\n🎯 **What I Can Do:**\n\n1️⃣ **Historical Analysis** - Scan 16 years (2010-2026) of audit data\n2️⃣ **Smart Filtering** - Filter by Year, State, Department, Source\n3️⃣ **Risk Explanation** - Click 🤖 on any row for detailed AI analysis\n4️⃣ **Future Audits** - View upcoming scheduled audits (type "upcoming audits")\n5️⃣ **Predictive Analytics** - Get risk predictions (type "risk predictions")\n6️⃣ **Data Export** - Download findings as CSV/Excel\n\n💬 **Try asking:**\n• "Show me upcoming audits"\n• "What are the risk predictions?"\n• "Explain case ID 3045"\n• Or just click Start Scan to begin!`
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // Access Control
    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard'); // Kick out non-admins
        }
    }, [user, navigate]);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleScan = async () => {
        setIsScanning(true);
        setScanStep(1);

        const yearText = filters.year === 'All Years' ? '15-year archives' : `fiscal year ${filters.year}`;
        const sourceText = filters.source === 'All Sources' ? 'all sources' : `${filters.source} archives`;
        const stateText = filters.state === 'All States' ? 'pan-India' : filters.state;

        // Add initiating message
        setChatMessages(prev => [...prev,
        { sender: 'user', text: `Scan ${sourceText} for ${yearText} in ${stateText}.` },
        { sender: 'agent', text: `Initiating targeted scan for ${yearText} across ${sourceText} focusing on ${stateText}...` }
        ]);

        const steps = [
            `Connecting to ${filters.source === 'News Media' ? 'News Agencies' : 'CAG & Ministry Databases'}...`,
            `Indexing ${filters.year === 'All Years' ? 'Historical' : filters.year} Records...`,
            `Filtering for ${filters.state}...`,
            "Finalizing Risk Models..."
        ];

        // Simulate progress steps
        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setScanStep(i + 1);
        }

        let results = await performAIScan();

        // Apply Local Filters
        if (filters.year !== 'All Years') {
            results = results.filter(r => r.date.includes(filters.year));
        }
        if (filters.source !== 'All Sources') {
            results = results.filter(r => r.sourceType === filters.source);
        }
        if (filters.state !== 'All States') {
            results = results.filter(r => r.state === filters.state);
        }
        if (filters.department !== 'All Departments') {
            results = results.filter(r => r.department === filters.department);
        }

        setIsScanning(false);
        setScanStep(0);

        if (results.length > 0) {
            setChatMessages(prev => [...prev, {
                sender: 'agent',
                text: `Scan complete. Found ${results.length} anomalies matching your criteria. Review the table.`
            }]);
        } else {
            setChatMessages(prev => [...prev, {
                sender: 'agent',
                text: `No anomalies found for these specific criteria.`
            }]);
        }
        // Updates the results shown in table (We need to update the AI Context to support 'filtered' results or just show this local subset)
        // Since useData uses a single state, we will temporarily cheat and set the state there, OR just handle display locally.
        // Better approach: We passed filters to performAIScan? No, performAIScan returns everything.
        // Let's rely on the displayed table using a local state for *display* if we want,
        // BUT performAIScan updates the global `aiScanResults`.
        // We validly need to FILTER what `performAIScan` put in the global state, OR invoke it with filters.
        // For Simplicity in this Mock: logic above filtered `results` array, but global state `aiScanResults` has everything.
        // Let's update global state to only show refined results?
        // Actually, performAIScan in DataContext imports *everything*.
        // Let's filter the valid results *after* getting them, and assume we only show the filtered ones in the table.
        // Wait, `aiScanResults` comes from context. We should probably filter it locally for display?
        // NO, existing code maps `aiScanResults`.
        // FIX: Let's assume performAIScan returns all, and we set a local state `displayedResults`?
        // OR better: The user wants to "Scan". Previous scan results are replaced.
        // So we should hack `performAIScan` to accept filters? No, let's just do client-side filtering of the display.
    };

    // We need to override the context's aiScanResults with our filtered version for display.
    // Or simpler: We just assume `performAIScan` brings data, and we filter it LOCALLY before rendering?
    // `aiScanResults` is from context.
    // Let's use a local variable for rendering.
    // Correction: `performAIScan` sets the global state.
    // To make this work cleanly without changing Context too much, let's just filter the *view* of `aiScanResults`.
    const displayedResults = aiScanResults.filter(item => {
        if (filters.year !== 'All Years' && !item.date.includes(filters.year)) return false;
        if (filters.source !== 'All Sources' && item.sourceType !== filters.source) return false;
        if (filters.state !== 'All States' && item.state !== filters.state) return false;
        if (filters.department !== 'All Departments' && item.department !== filters.department) return false;
        return true;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = displayedResults.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedResults.length / itemsPerPage);

    // Reset pagination when filters change or scan happens
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, aiScanResults]);


    const handleImport = () => {
        if (displayedResults.length === 0) return;
        importAiFindings(displayedResults);
        setChatMessages(prev => [...prev,
        { sender: 'user', text: 'Import these findings.' },
        { sender: 'agent', text: 'Done. The records have been added to the Master Dashboard.' }
        ]);
    };

    const handleImportSingle = (record) => {
        importAiFindings(record);
        setChatMessages(prev => [...prev,
        { sender: 'user', text: `Import case #${record.id}.` },
        { sender: 'agent', text: `Case #${record.id} has been successfully imported to the Master Dashboard.` }
        ]);
    };

    const handleExplain = (record) => {
        const prompt = `Explain the risk for ${record.department}`;
        const response = record.aiAnalysis || "I have flagged this due to statistical deviation from standard spending patterns.";

        setChatMessages(prev => [...prev,
        { sender: 'user', text: prompt },
        { sender: 'agent', text: response }
        ]);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
        const inputLower = chatInput.toLowerCase();

        // Enhanced AI bot logic with upcoming audits and predictions
        setTimeout(() => {
            let response = "I primarily analyze spending data. You can ask me to scan public sources, explain specific findings, or view upcoming audits.";

            // Greetings
            if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey') || inputLower.includes('नमस्ते')) {
                response = "👋 नमस्ते! I'm PRAGATI-AI, ready to assist with audit intelligence. Type 'help' or 'commands' to see what I can do!";
            }

            // Commands List
            else if (inputLower.includes('commands') || inputLower.includes('command list')) {
                response = `📜 **Complete Command List:**\n\n**General:**\n• \`help\`, \`features\` - Show capabilities\n• \`hi\`, \`hello\`, \`नमस्ते\` - Greet me\n• \`commands\` - This list\n\n**Data Analysis:**\n• \`upcoming audits\` - View 2026-2027 schedule\n• \`risk predictions\` - Future risk areas\n• \`history\`, \`archive\` - Historical data info\n\n**State Queries:**\n• \`bihar\`, \`delhi\` - State-specific insights\n\n**Technical:**\n• \`risk\`, \`score\` - Risk methodology\n• \`source\`, \`cag\` - Data sources\n• \`export\`, \`download\` - Export guide\n\nType any command to try it!`;
            }

            // Help / Features
            else if (inputLower.includes('help') || inputLower.includes('features') || inputLower.includes('what can you do')) {
                response = `🎯 **My Capabilities:**\n\n1️⃣ **Historical Analysis** - Scan 16 years (2010-2026) of audit data\n2️⃣ **Smart Filtering** - Filter by Year, State, Department, Source\n3️⃣ **Risk Explanation** - Click 🤖 on any row for detailed analysis\n4️⃣ **Future Audits** - Type "upcoming audits" to see scheduled audits\n5️⃣ **Predictive Analytics** - Type "risk predictions" for future risk areas\n6️⃣ **Data Export** - Download findings as CSV/Excel\n\n💡 **Quick Commands:**\n• "upcoming audits" - View scheduled audits for 2026-2027\n• "risk predictions" - See high-risk areas\n• "scan" - Start a new audit scan\n• "explain [case ID]" - Get detailed analysis`;
            }

            // Upcoming Audits
            else if (inputLower.includes('upcoming') || inputLower.includes('future audit') || inputLower.includes('scheduled')) {
                const upcomingList = upcomingAudits.slice(0, 5).map(audit => `📅 **${audit.id}** - ${audit.scheduledDate}\n   ${audit.scheme} (${audit.state})\n   Priority: ${audit.priority} | Risk: ${audit.predictedRiskScore}/100`
                ).join('\n\n');
                response = `📊 **Upcoming Scheduled Audits (Next 5):**\n\n${upcomingList}\n\n**Summary:**\n• Total Scheduled: ${auditCalendarSummary.totalScheduled}\n• Critical Priority: ${auditCalendarSummary.byPriority.critical}\n• High Priority: ${auditCalendarSummary.byPriority.high}\n• Budget Under Review: ₹${(auditCalendarSummary.totalBudgetUnderReview / 1000000000).toFixed(1)}B`;
            }

            // Risk Predictions
            else if (inputLower.includes('risk prediction') || inputLower.includes('predictive') || inputLower.includes('future risk')) {
                const riskList = predictiveRiskAreas.map(area => `⚠️ **${area.category}** - ${area.riskLevel} Risk\n   Issues: ${area.predictedIssues.join(', ')}\n   Actions: ${area.recommendedActions[0]}`
                ).join('\n\n');
                response = `🔮 **Predictive Risk Analytics:**\n\n${riskList}\n\n💡 These predictions are based on historical patterns and current trends.`;
            }

            // Historical queries
            else if (inputLower.includes('history') || inputLower.includes('2010') || inputLower.includes('archive')) {
                response = "📚 I have full access to archives dating back to 2010 (16 years). You can filter by any specific year using the dropdown filters above.";
            }

            // State-specific queries
            else if (inputLower.includes('bihar')) {
                response = "📍 Bihar often shows delays in Utilisation Certificates. My historical data confirms this trend across multiple years, particularly in MGNREGA and rural development schemes.";
            }
            else if (inputLower.includes('delhi')) {
                response = "📍 Delhi has shown improved compliance in recent years, though infrastructure projects still require close monitoring for cost overruns.";
            }

            // Risk scoring
            else if (inputLower.includes('risk') || inputLower.includes('score')) {
                response = "📊 I calculate risk scores (0-100) based on 6 parameters aligned with CAG standards:\n• Amount vs Historical Average\n• Transaction Frequency\n• Vendor Concentration\n• Beneficiary Count\n• Anomaly Type\n• Source Reliability\n\nScores above 75 are flagged as high-risk.";
            }

            // Data sources
            else if (inputLower.includes('source') || inputLower.includes('cag') || inputLower.includes('data from')) {
                response = "📂 My data sources include:\n• CAG Reports (40%)\n• Ministry Audits (30%)\n• RTI Disclosures (20%)\n• Investigative Media (10%)\n\nAll sources are cross-verified for accuracy.";
            }

            // Export
            else if (inputLower.includes('export') || inputLower.includes('download')) {
                response = "💾 You can export current findings using the CSV or Excel buttons above the results table. The export includes all filtered data with complete details.";
            }

            setChatMessages(prev => [...prev, { sender: 'agent', text: response }]);
        }, 1000);

        setChatInput('');
    };


    const [selectedReport, setSelectedReport] = useState(null);

    const downloadCSV = () => {
        if (displayedResults.length === 0) return;
        const headers = ["ID", "Department", "Scheme", "Vendor", "Amount", "Date", "State", "Risk Score", "Issue", "Source"];
        const rows = displayedResults.map(r => [
            r.id, r.department, r.scheme, r.vendorName, r.amountDisbursed, r.date, r.state, r.riskScore, r.anomalyType, r.sourceType
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `audit_scan_report_${filters.year}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadExcel = () => {
        if (displayedResults.length === 0) return;
        // Simple HTML Table export which Excel opens reliably
        let html = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table>';
        html += '<tr><th>ID</th><th>Department</th><th>Scheme</th><th>Vendor</th><th>Amount</th><th>Risk Score</th><th>Issue</th><th>Analysis</th></tr>';
        displayedResults.forEach(r => {
            html += `<tr><td>${r.id}</td><td>${r.department}</td><td>${r.scheme}</td><td>${r.vendorName}</td><td>${r.amountDisbursed}</td><td>${r.riskScore}</td><td>${r.anomalyType}</td><td>${r.aiAnalysis}</td></tr>`;
        });
        html += '</table></body></html>';

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `detailed_audit_report_${new Date().toISOString().slice(0, 10)}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (user?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            {/* Modal Overlay */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up border border-gray-700">
                        <div className="bg-[#0b3c6f] text-white p-4 flex justify-between items-center rounded-t-lg">
                            <h3 className="text-lg font-bold"><i className="fas fa-file-alt mr-2"></i> Detailed Intelligence Report</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-white hover:text-red-300 text-xl font-bold">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedReport.vendorName}</h2>
                                    <p className="text-sm text-gray-500">{selectedReport.department} | {selectedReport.scheme}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${selectedReport.riskScore > 75 ? 'text-red-600' : 'text-yellow-600'}`}>{selectedReport.riskScore}/100</div>
                                    <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Risk Score</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded">
                                    <span className="block text-xs font-bold text-gray-500 uppercase">Detection Source</span>
                                    <a href={selectedReport.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 flex items-center gap-1">
                                        {selectedReport.sourceType} <i className="fas fa-external-link-alt text-[10px]"></i>
                                    </a>
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <span className="block text-xs font-bold text-gray-500 uppercase">Detected On</span>
                                    <span className="text-gray-800">{selectedReport.date}</span>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded border-l-4 border-indigo-500 overflow-hidden">
                                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    <img src="https://cdn-icons-png.flaticon.com/256/14657/14657058.png" alt="PRAGATI-AI" className="w-5 h-5" />
                                    AI Analysis
                                </h4>
                                <div className="text-indigo-800 text-sm leading-relaxed break-words whitespace-pre-wrap max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedReport.aiAnalysis}
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded border border-red-100">
                                <h4 className="font-bold text-red-900 mb-1">Primary Flag: {selectedReport.anomalyType}</h4>
                                <p className="text-red-700 text-sm">{selectedReport.flagReason}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-lg">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm font-bold"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { handleImport(); setSelectedReport(null); }}
                                className="px-4 py-2 bg-[#0b3c6f] text-white rounded text-sm font-bold hover:bg-blue-800 shadow"
                            >
                                Import to Audit Queue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header - Full Width */}
            <header className="bg-[#1a202c] text-white py-4 px-6 shadow-md border-b-4 border-yellow-400 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white mr-2" title="Back to Dashboard">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <img src="https://cdn-icons-png.flaticon.com/256/14657/14657058.png" alt="PRAGATI-AI" className="w-8 h-8" />
                            AI Audit Assistant
                        </h1>
                    </div>
                </div>
                <div className="text-right flex items-center gap-4">
                    <span className="text-xs text-gray-400 hidden sm:inline-block">Autonomous Anomaly Detection System v2.1</span>
                    <span className="bg-red-900 text-red-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-red-700">
                        Restricted Access
                    </span>
                </div>
            </header>

            {/* Main Content - Full Width - Grid Layout */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 bg-gray-100 overflow-hidden h-[calc(100vh-76px)]">

                {/* LEFT PANEL: FILTERS & RESULTS (Scrollable) */}
                <div className="lg:col-span-3 flex flex-col h-full overflow-hidden border-r border-gray-300">

                    {/* Top Control Bar */}
                    <div className="bg-white p-4 shadow-sm z-10 border-b border-gray-200">
                        <div className="flex flex-wrap gap-3 items-end">
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fiscal Year</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                                    value={filters.year}
                                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                >
                                    <option>All Years</option>
                                    {YEARS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Data Source</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                                    value={filters.source}
                                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                >
                                    <option>All Sources</option>
                                    <option>CAG Report</option>
                                    <option>Ministry Report</option>
                                    <option>News Media</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">State</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                                    value={filters.state}
                                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                >
                                    <option>All States</option>
                                    {availableStates.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Department</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50"
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                >
                                    <option>All Departments</option>
                                    {availableDepartments.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className={`px-4 py-1.5 rounded text-white font-bold shadow transition-all whitespace-nowrap ${isScanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {isScanning ? <><i className="fas fa-circle-notch fa-spin mr-2"></i>Scanning...</> : <><i className="fas fa-satellite-dish mr-2"></i>Start Scan</>}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {isScanning && (
                            <div className="mt-3">
                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${scanStep * 25}%` }}></div>
                                </div>
                                <p className="text-[10px] text-indigo-600 font-mono mt-1 text-right">
                                    {['Initializing...', 'Connecting to CAG...', 'Indexing Data...', 'Finalizing...'][scanStep]}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-hidden bg-white relative flex flex-col">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-sm">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <i className="fas fa-list-alt text-indigo-500"></i> Findings ({displayedResults.length})
                            </h3>
                            <div className="flex gap-2">
                                {displayedResults.length > 0 && (
                                    <>
                                        <button onClick={downloadCSV} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"><i className="fas fa-file-csv mr-1"></i>CSV</button>
                                        <button onClick={downloadExcel} className="text-xs bg-white text-green-700 px-2 py-1 rounded border border-gray-300 hover:bg-green-50"><i className="fas fa-file-excel mr-1"></i>Excel</button>
                                        <button onClick={handleImport} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 font-bold"><i className="fas fa-plus mr-1"></i>Import All</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {displayedResults.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                    <i className="fas fa-search text-5xl mb-4 opacity-10"></i>
                                    <p>Ready to Scan.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-white text-xs uppercase text-gray-500 font-bold sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 py-3 bg-gray-50 border-b">Details</th>
                                            <th className="px-4 py-3 bg-gray-50 border-b">Anomaly Flag</th>
                                            <th className="px-4 py-3 bg-gray-50 border-b text-right">Score</th>
                                            <th className="px-4 py-3 bg-gray-50 border-b text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {currentItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-3 align-top">
                                                    <div className="font-bold text-gray-800">{item.vendorName}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.department}</div>
                                                    <div className="text-[10px] text-gray-400 mt-1">{item.state} • {item.date}</div>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-1 ${item.anomalyType === 'Multiple Flags' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                                        {item.anomalyType}
                                                    </span>
                                                    <div className="text-xs text-gray-600 leading-snug">{item.flagReason}</div>
                                                </td>
                                                <td className="px-4 py-3 align-top text-right">
                                                    <div className="font-mono font-bold text-indigo-900 text-lg">{item.riskScore}</div>
                                                </td>
                                                <td className="px-4 py-3 align-top text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => setSelectedReport(item)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded transition-colors" title="View"><i className="fas fa-eye"></i></button>
                                                        <button onClick={() => handleExplain(item)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded transition-colors" title="Analyze">
                                                            <img src="https://cdn-icons-png.flaticon.com/256/14657/14657058.png" alt="Analyze" className="w-4 h-4 opacity-70 hover:opacity-100" />
                                                        </button>
                                                        <button onClick={() => handleImportSingle(item)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-white rounded transition-colors" title="Import"><i className="fas fa-file-import"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer Pagination */}
                        {displayedResults.length > itemsPerPage && (
                            <div className="bg-gray-50 border-t border-gray-200 p-2 flex justify-between items-center text-xs text-gray-500">
                                <span>Page {currentPage} of {totalPages}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: CHAT INTERFACE - Fixed Container */}
                {!isChatMinimized && (
                    <div className="lg:col-span-1 bg-[#1a202c] border-l border-gray-700 flex flex-col shadow-2xl relative z-20" style={{ height: 'calc(100vh - 76px)' }}>
                        <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">PRAGATI-AI</span>
                                    <span className="font-mono text-gray-400 text-[10px] tracking-wider">PRAGATI_AI_ONLINE</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatMinimized(true)}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                                title="Minimize Chat"
                            >
                                <i className="fas fa-minus text-xs"></i>
                            </button>
                        </div>

                        {/* Fixed Height Chat Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0f121a]" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] rounded p-3 text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                                        : 'bg-gray-800 text-green-100 font-mono border-l-2 border-green-500 rounded-bl-none shadow-md'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-3 bg-gray-800 border-t border-gray-700 flex-shrink-0">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-[#1e2330] text-gray-200 border border-gray-600 rounded pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-[#252a3a] transition-colors font-mono"
                                    placeholder="Command PRAGATI-AI..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)} />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Minimized Chat Button */}
                {isChatMinimized && (
                    <button
                        onClick={() => setIsChatMinimized(false)}
                        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all z-50 flex items-center gap-2 animate-pulse"
                        title="Open PRAGATI-AI Chat"
                    >
                        <img src="https://cdn-icons-png.flaticon.com/256/14657/14657058.png" alt="PRAGATI-AI" className="w-6 h-6" />
                        <span className="font-bold text-sm">PRAGATI-AI</span>
                    </button>
                )}

            </main>

            {/* Local Footer for AI Monitor */}
            <footer className="bg-[#1a202c] text-white py-3 border-t border-gray-700 text-xs text-center flex justify-between px-8 z-50">
                <span className="text-gray-400">© 2026 Directorate of Audit, Government of NCT of Delhi</span>
                <span className="text-gray-500">
                    Powered by <span className="text-indigo-400 font-bold">NIC AI Labs</span> | v2.1.0
                </span>
            </footer>
        </div>
    );
}

export default AIMonitor;
