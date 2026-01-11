import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { govtSpendingData } from '../data/govtSpendingData';
import { calculateRiskScore } from '../utils/riskLogic';
import { parseCSV, normalizeUploadedData } from '../utils/csvParser';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    // 1. Initialize State from LocalStorage (for Shared Persistence)
    const [rawData, setRawData] = useState(() => {
        const stored = localStorage.getItem('govtData_v1');
        const parsed = stored ? JSON.parse(stored) : null;
        // Auto-recovery: If stored data is empty or too small (legacy bug), restore defaults
        return (parsed && parsed.length > 2) ? parsed : govtSpendingData;
    });

    const [riskThreshold, setRiskThreshold] = useState(() => {
        const stored = localStorage.getItem('riskThreshold_v1');
        return stored ? parseInt(stored) : 75;
    });

    const [auditFeedback, setAuditFeedback] = useState(() => {
        const stored = localStorage.getItem('auditFeedback_v1');
        return stored ? JSON.parse(stored) : {};
    });

    const [auditStatus, setAuditStatus] = useState(() => {
        const stored = localStorage.getItem('auditStatus_v1');
        return stored ? JSON.parse(stored) : {};
    });

    const [isLoading, setIsLoading] = useState(false);

    // 2. Persist State Changes to LocalStorage
    useEffect(() => {
        localStorage.setItem('govtData_v1', JSON.stringify(rawData));
    }, [rawData]);

    useEffect(() => {
        localStorage.setItem('riskThreshold_v1', riskThreshold.toString());
    }, [riskThreshold]);

    useEffect(() => {
        localStorage.setItem('auditFeedback_v1', JSON.stringify(auditFeedback));
    }, [auditFeedback]);

    useEffect(() => {
        localStorage.setItem('auditStatus_v1', JSON.stringify(auditStatus));
    }, [auditStatus]);


    // Enrich data with risk scores
    const enrichedData = useMemo(() => {
        return rawData.map(record => {
            const riskData = calculateRiskScore(record);
            return {
                ...record,
                riskScore: riskData.score,
                riskLevel: riskData.riskLevel,
                riskReasons: riskData.reasons,
                auditStatus: auditStatus[record.id] || 'Pending'
            };
        });
    }, [rawData, auditStatus]);

    const filteredHighRiskData = useMemo(() => {
        return enrichedData.filter(record => {
            // Include if score is high OR if explicitly marked as Valid (High Risk) by manual review
            const isHighScore = record.riskScore >= riskThreshold;
            const isMarkedValid = auditFeedback[record.id]?.status === 'valid';
            const isMarkedSafe = auditFeedback[record.id]?.status === 'false_alarm';

            // If marked safe, exclude even if score is high. 
            // If marked valid, include even if score is low.
            if (isMarkedSafe) return false;
            if (isMarkedValid) return true;

            return isHighScore;
        });
    }, [enrichedData, riskThreshold, auditFeedback]);


    // Upload new data
    const uploadData = async (file) => {
  setIsLoading(true)

  try {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    })

    const records = await res.json()

    setRawData(prev => [...prev, ...records])
    setIsLoading(false)

    return { success: true, count: records.length }
  } catch (e) {
    setIsLoading(false)
    return { success: false, error: "Upload failed" }
  }
}


            // Add unique IDs if missing to prevent duplicate key issues
            const recordsWithIds = normalizedRecords.map(r => ({
                ...r,
                id: r.id || Math.random().toString(36).substr(2, 9),
                auditStatus: 'Pending' // Default new records to pending
            }));

            setRawData(prev => [...prev, ...recordsWithIds]);

            setIsLoading(false);
            return { success: true, count: recordsWithIds.length };
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Mark audit feedback
    const markAsValid = (recordId) => {
        const timestamp = new Date().toISOString();
        setAuditFeedback(prev => ({ ...prev, [recordId]: { status: 'valid', timestamp } }));
        setAuditStatus(prev => ({ ...prev, [recordId]: 'Reviewed' }));
    };

    const markAsFalseAlarm = (recordId) => {
        const timestamp = new Date().toISOString();
        setAuditFeedback(prev => ({ ...prev, [recordId]: { status: 'false_alarm', timestamp } }));
        setAuditStatus(prev => ({ ...prev, [recordId]: 'Reviewed' }));
    };

    const markAsEscalated = (recordId) => {
        setAuditStatus(prev => ({ ...prev, [recordId]: 'Escalated' }));
    };

    const resolveEscalation = (recordId, resolution, notes = '') => {
        const timestamp = new Date().toISOString();
        // resolution: 'approved' (Valid) or 'rejected' (False Alarm)
        const status = resolution === 'approved' ? 'valid' : 'false_alarm';

        setAuditFeedback(prev => ({
            ...prev,
            [recordId]: {
                status: status,
                timestamp,
                resolvedBy: 'Admin',
                adminNotes: notes
            }
        }));

        // Update status to Resolved so it leaves the Escalated queue
        setAuditStatus(prev => ({ ...prev, [recordId]: 'Resolved' }));
    };

    // AI Scan State
    const [aiScanResults, setAiScanResults] = useState([]);

    // AI Scan Function
    const performAIScan = () => {
        return new Promise((resolve) => {
            // Simulate network delay for "Scanning" effect
            setTimeout(() => {
                import('../data/aiFoundData').then(module => {
                    const newFindings = module.aiFoundData;
                    // Filter out already imported IDs to avoid duplicates
                    const uniqueFindings = newFindings.filter(f => !rawData.some(r => r.id === f.id));
                    setAiScanResults(uniqueFindings);
                    resolve(uniqueFindings);
                });
            }, 2500); // 2.5s delay for realism
        });
    };

    // Import AI Findings to Main Data
    const importAiFindings = (findingsToImport) => {
        const timestamp = new Date().toISOString();
        const findingsArray = Array.isArray(findingsToImport) ? findingsToImport : [findingsToImport];

        const recordsWithStatus = findingsArray.map(r => ({
            ...r,
            isAiDiscovered: true,
            importedAt: timestamp,
            auditStatus: 'Pending'
        }));

        setRawData(prev => [...prev, ...recordsWithStatus]);

        // Remove only the imported items from the temporary "Found" state
        const importedIds = new Set(findingsArray.map(f => f.id));
        setAiScanResults(prev => prev.filter(f => !importedIds.has(f.id)));
    };

    // New: Reset System (for demos)  


    // Reset System Data
    const resetData = () => {
        if (window.confirm("Are you sure you want to reset all system data to factory defaults? This cannot be undone.")) {
            localStorage.removeItem('govtData_v1');
            localStorage.removeItem('riskThreshold_v1');
            localStorage.removeItem('auditFeedback_v1');
            localStorage.removeItem('auditStatus_v1');

            setRawData(govtSpendingData);
            setRiskThreshold(75);
            setAuditFeedback({});
            setAuditStatus({});

            // Allow state to update
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    const value = {
        rawData,
        enrichedData,
        riskThreshold,
        setRiskThreshold,
        auditFeedback,
        auditStatus,
        markAsValid,
        markAsFalseAlarm,
        markAsEscalated,
        resolveEscalation,
        uploadData,
        resetData,
        aiScanResults,
        performAIScan,
        importAiFindings,
        isLoading
    };


    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
