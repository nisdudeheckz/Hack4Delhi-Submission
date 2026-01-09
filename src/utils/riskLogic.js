// AI-like Risk Scoring Logic (Rule-based simulation)

export const calculateRiskScore = (record) => {
    let score = 0;
    const reasons = [];

    // Rule 1: Amount vs Historical Average
    const amountRatio = record.amountDisbursed / record.avgHistoricalAmount;
    if (amountRatio > 2.5) {
        score += 35;
        reasons.push(`Payment is ${amountRatio.toFixed(1)}x higher than historical average`);
    } else if (amountRatio > 2.0) {
        score += 30;
        reasons.push(`Payment is ${amountRatio.toFixed(1)}x higher than historical average`);
    } else if (amountRatio > 1.5) {
        score += 15;
        reasons.push(`Payment moderately elevated (${amountRatio.toFixed(1)}x)`);
    }

    // Rule 2: Transaction Frequency
    if (record.transactionFrequency > 20) {
        score += 20;
        reasons.push(`Very high transaction frequency (${record.transactionFrequency} transactions)`);
    } else if (record.transactionFrequency > 15) {
        score += 10;
        reasons.push(`Elevated transaction frequency (${record.transactionFrequency} transactions)`);
    }

    // Rule 3: Vendor Concentration (check if vendor appears multiple times)
    if (record.flagReason.includes('78%') || record.flagReason.includes('82%')) {
        score += 25;
        reasons.push('Vendor concentration detected across multiple contracts');
    } else if (record.vendorName !== 'N/A (Direct Transfer)' && record.transactionFrequency > 12) {
        score += 15;
        reasons.push('Vendor appears frequently in recent transactions');
    }

    // Rule 4: Beneficiary Density Anomaly
    if (record.beneficiaryCount > 10000) {
        const beneficiaryRatio = record.amountDisbursed / record.beneficiaryCount;
        if (beneficiaryRatio > 5000) {
            score += 15;
            reasons.push(`High per-beneficiary amount (₹${beneficiaryRatio.toFixed(0)})`);
        }
    }

    // Rule 5: Multiple Flags
    if (record.anomalyType === 'Multiple Flags') {
        score += 20;
        reasons.push('Multiple anomaly indicators detected');
    }

    // Rule 6: Beneficiary Anomaly
    if (record.anomalyType === 'Beneficiary Anomaly') {
        score += 25;
        reasons.push('Beneficiary count exceeds demographic projections');
    }

    // Normalize to 0-100 range
    score = Math.min(score, 100);

    return {
        score: Math.round(score),
        reasons: reasons.length > 0 ? reasons : ['Standard operational parameters'],
        riskLevel: score > 75 ? 'High' : score > 50 ? 'Medium' : 'Low'
    };
};

export const getRiskColor = (score) => {
    if (score > 80) return 'bg-red-50 border-red-200';
    if (score > 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-white border-gray-200';
};

export const getRiskBadgeColor = (score) => {
    if (score > 80) return 'bg-red-600 text-white';
    if (score > 60) return 'bg-yellow-500 text-white';
    return 'bg-green-600 text-white';
};

export const getRiskLevel = (score) => {
    if (score > 75) return 'High';
    if (score > 50) return 'Medium';
    return 'Low';
};

export const generateExplanation = (record, riskData) => {
    const { score, reasons } = riskData;

    let explanation = `This transaction has been flagged with a risk score of ${score}/100. `;

    if (score > 75) {
        explanation += 'This is classified as HIGH RISK and requires immediate audit review. ';
    } else if (score > 50) {
        explanation += 'This is classified as MEDIUM RISK and should be reviewed when resources permit. ';
    } else {
        explanation += 'This is classified as LOW RISK but has been included for completeness. ';
    }

    explanation += '\n\nKey Indicators:\n';
    reasons.forEach((reason, idx) => {
        explanation += `${idx + 1}. ${reason}\n`;
    });

    explanation += `\nTransaction Details:\n`;
    explanation += `• Scheme: ${record.scheme}\n`;
    explanation += `• Department: ${record.department}\n`;
    explanation += `• Amount Disbursed: ₹${(record.amountDisbursed / 100000).toFixed(2)} Lakhs\n`;
    explanation += `• Historical Average: ₹${(record.avgHistoricalAmount / 100000).toFixed(2)} Lakhs\n`;
    explanation += `• Vendor: ${record.vendorName}\n`;

    if (record.beneficiaryCount > 0) {
        explanation += `• Beneficiaries: ${record.beneficiaryCount.toLocaleString('en-IN')}\n`;
    }

    return explanation;
};
