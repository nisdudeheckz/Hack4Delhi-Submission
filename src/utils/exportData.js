// Data Export Utilities

export const exportToCSV = (data, filename = 'govt_spending_data.csv') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Define headers
    const headers = [
        'ID',
        'State',
        'District',
        'Department',
        'Scheme',
        'Vendor',
        'Beneficiaries',
        'Amount Disbursed',
        'Historical Average',
        'Transaction Frequency',
        'Risk Score',
        'Risk Level',
        'Anomaly Type',
        'Flag Reason',
        'Audit Status',
        'Last Updated'
    ];

    // Build CSV content
    let csvContent = headers.join(',') + '\n';

    data.forEach(record => {
        const row = [
            record.id,
            `"${record.state}"`,
            `"${record.district}"`,
            `"${record.department}"`,
            `"${record.scheme}"`,
            `"${record.vendorName}"`,
            record.beneficiaryCount,
            record.amountDisbursed,
            record.avgHistoricalAmount,
            record.transactionFrequency,
            record.riskScore || 0,
            record.riskLevel || 'Unknown',
            `"${record.anomalyType}"`,
            `"${record.flagReason}"`,
            record.auditStatus || 'Pending',
            record.lastUpdated
        ];
        csvContent += row.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportHighRiskOnly = (data) => {
    const highRiskData = data.filter(record => record.riskScore > 75);
    exportToCSV(highRiskData, 'high_risk_cases.csv');
};

export const exportAuditReport = (data, auditFeedback) => {
    const reviewedData = data.filter(record => auditFeedback[record.id]);

    const enrichedData = reviewedData.map(record => ({
        ...record,
        auditorFeedback: auditFeedback[record.id]?.status || 'Unknown',
        reviewedAt: auditFeedback[record.id]?.timestamp || 'N/A'
    }));

    if (enrichedData.length === 0) {
        alert('No reviewed cases to export');
        return;
    }

    // Custom headers for audit report
    const headers = [
        'ID',
        'State',
        'District',
        'Department',
        'Scheme',
        'Vendor',
        'Amount Disbursed',
        'Risk Score',
        'Anomaly Type',
        'Auditor Feedback',
        'Reviewed At',
        'Audit Status'
    ];

    let csvContent = headers.join(',') + '\n';

    enrichedData.forEach(record => {
        const row = [
            record.id,
            `"${record.state}"`,
            `"${record.district}"`,
            `"${record.department}"`,
            `"${record.scheme}"`,
            `"${record.vendorName}"`,
            record.amountDisbursed,
            record.riskScore,
            `"${record.anomalyType}"`,
            `"${record.auditorFeedback}"`,
            record.reviewedAt,
            record.auditStatus || 'Reviewed'
        ];
        csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit_report.csv';
    link.click();
    URL.revokeObjectURL(url);
};

export const generateAuditSummary = (data, auditFeedback) => {
    const totalCases = data.length;

    // Helper to determine if a case is effectively High Risk
    const isEffectiveHighRisk = (record) => {
        const score = record.riskScore || 0;
        const feedback = auditFeedback[record.id]?.status;

        // If explicitly marked Safe (False Alarm), it's NOT high risk
        if (feedback === 'false_alarm') return false;

        // If explicitly marked Valid (High Risk), it IS high risk
        if (feedback === 'valid') return true;

        // Otherwise, fallback to score threshold
        return score > 75;
    };

    const highRiskRecords = data.filter(isEffectiveHighRisk);
    const highRiskCases = highRiskRecords.length;

    const reviewedCases = Object.keys(auditFeedback).length;
    const validConcerns = Object.values(auditFeedback).filter(f => f.status === 'valid').length;
    const falseAlarms = Object.values(auditFeedback).filter(f => f.status === 'false_alarm').length;
    const falsePositiveRate = reviewedCases > 0 ? ((falseAlarms / reviewedCases) * 100).toFixed(1) : 0;

    const fundsUnderRisk = highRiskRecords
        .reduce((sum, d) => sum + d.amountDisbursed, 0);

    return {
        totalCases,
        highRiskCases,
        reviewedCases,
        validConcerns,
        falseAlarms,
        falsePositiveRate,
        fundsUnderRisk
    };
};
