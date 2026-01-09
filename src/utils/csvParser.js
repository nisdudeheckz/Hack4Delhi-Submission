// CSV Parser Utility
export const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const record = {};

        headers.forEach((header, index) => {
            let value = values[index] || '';

            // Try to parse numbers
            if (!isNaN(value) && value !== '') {
                value = Number(value);
            }

            record[header] = value;
        });

        data.push(record);
    }

    return data;
};

export const validateGovtData = (record) => {
    const requiredFields = [
        'state',
        'district',
        'department',
        'scheme',
        'vendorName',
        'amountDisbursed',
        'avgHistoricalAmount'
    ];

    for (const field of requiredFields) {
        if (!(field in record)) {
            return false;
        }
    }

    return true;
};

export const normalizeUploadedData = (records) => {
    return records.map((record, index) => ({
        id: Date.now() + index,
        state: record.state || 'Unknown',
        district: record.district || 'Unknown',
        department: record.department || 'Unknown',
        scheme: record.scheme || 'Unknown',
        vendorName: record.vendorName || 'N/A',
        beneficiaryCount: Number(record.beneficiaryCount) || 0,
        amountDisbursed: Number(record.amountDisbursed) || 0,
        avgHistoricalAmount: Number(record.avgHistoricalAmount) || 0,
        transactionFrequency: Number(record.transactionFrequency) || 1,
        anomalyType: record.anomalyType || 'Pending Analysis',
        flagReason: record.flagReason || 'Uploaded data - pending analysis',
        lastUpdated: new Date().toISOString().split('T')[0]
    }));
};
