import React from 'react';
import { generateExplanation } from '../utils/riskLogic';
import { useData } from '../context/DataContext';

const ExplainPanel = ({ record, riskData, onClose }) => {
    const { markAsValid, markAsFalseAlarm, markAsEscalated, resolveEscalation } = useData();

    if (!record) return null;

    const explanation = generateExplanation(record, riskData);

    const handleMarkValid = () => {
        markAsValid(record.id);
        alert('Record marked as Valid Concern. This feedback has been logged for audit review.');
        onClose();
    };

    const handleMarkFalseAlarm = () => {
        markAsFalseAlarm(record.id);
        alert('Record marked as False Alarm. This feedback will improve future risk scoring.');
        onClose();
    };

    const handleEscalate = () => {
        markAsEscalated(record.id);
        alert('Case escalated for senior review.');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">
                        Risk Analysis Explanation
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{record.scheme}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {record.state} • {record.district} • {record.department}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center px-3 py-1 rounded text-sm font-bold ${riskData.score > 80 ? 'bg-red-600 text-white' :
                                    riskData.score > 60 ? 'bg-yellow-500 text-white' :
                                        'bg-green-600 text-white'
                                    }`}>
                                    Risk: {riskData.score}/100
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                            {explanation}
                        </pre>
                    </div>

                    {/* Human-in-the-Loop Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide font-medium">
                            {record.auditStatus === 'Escalated' ? 'Admin Review Required' : 'Auditor Action Required'}
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            {/* Admin View for Escalated Cases */}
                            {record.auditStatus === 'Escalated' ? (
                                <>
                                    <button
                                        onClick={() => {
                                            resolveEscalation(record.id, 'approved', 'Confirmed by Admin');
                                            alert('Escalation Approved: Marked as High Risk.');
                                            onClose();
                                        }}
                                        className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
                                    >
                                        <i className="fas fa-check-circle mr-2"></i> Confirm High Risk
                                    </button>
                                    <button
                                        onClick={() => {
                                            resolveEscalation(record.id, 'rejected', 'Dismissed by Admin');
                                            alert('Escalation Rejected: Marked as False Alarm.');
                                            onClose();
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-150"
                                    >
                                        <i className="fas fa-times-circle mr-2"></i> Dismiss as Safe
                                    </button>
                                </>
                            ) : (
                                /* Standard Auditor View */
                                <>
                                    <button
                                        onClick={handleMarkValid}
                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-150"
                                    >
                                        Mark as Valid Concern
                                    </button>
                                    <button
                                        onClick={handleMarkFalseAlarm}
                                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-150"
                                    >
                                        Mark as False Alarm
                                    </button>
                                    <button
                                        onClick={handleEscalate}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
                                    >
                                        Escalate Case
                                    </button>
                                </>
                            )}

                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplainPanel;
