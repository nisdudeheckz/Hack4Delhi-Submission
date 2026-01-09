import React from 'react';


const NoticeBoard = () => {
    const notices = [
        { title: "Circular: Updated Audit Guidelines 2026", date: "Jan 10, 2026", type: "Circular" },
        { title: "Notification: Submission of Annual Expenditure Reports", date: "Jan 08, 2026", type: "Notification" },
        { title: "Order: Appointment of New Auditor General", date: "Jan 05, 2026", type: "Order" },
        { title: "Tender: Maintenance of IT Infrastructure", date: "Jan 02, 2026", type: "Tender" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
                    Notice Board
                </h1>
                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0b3c6f] text-white">
                            <tr>
                                <th className="p-4 border-b">Date</th>
                                <th className="p-4 border-b">Type</th>
                                <th className="p-4 border-b">Subject / Title</th>
                                <th className="p-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice, i) => (
                                <tr key={i} className="hover:bg-blue-50 border-b last:border-0 text-sm bg-white">
                                    <td className="p-4 text-gray-600 font-medium whitespace-nowrap">{notice.date}</td>
                                    <td className="p-4">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">{notice.type}</span>
                                    </td>
                                    <td className="p-4 text-[#0b3c6f] font-semibold">{notice.title}</td>
                                    <td className="p-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold">
                                            <i className="fas fa-download mr-1"></i> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default NoticeBoard;
