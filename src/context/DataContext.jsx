import React, { createContext, useContext, useState, useMemo, useEffect } from "react"
import { govtSpendingData } from "../data/govtSpendingData"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error("useData must be used within DataProvider")
  return context
}

export const DataProvider = ({ children }) => {
  const [rawData, setRawData] = useState(() => {
    const stored = localStorage.getItem("govtData_v1")
    const parsed = stored ? JSON.parse(stored) : null
    return parsed && parsed.length > 2 ? parsed : govtSpendingData
  })

  const [riskThreshold, setRiskThreshold] = useState(() => {
    const stored = localStorage.getItem("riskThreshold_v1")
    return stored ? parseInt(stored) : 75
  })

  const [auditFeedback, setAuditFeedback] = useState(() => {
    const stored = localStorage.getItem("auditFeedback_v1")
    return stored ? JSON.parse(stored) : {}
  })

  const [auditStatus, setAuditStatus] = useState(() => {
    const stored = localStorage.getItem("auditStatus_v1")
    return stored ? JSON.parse(stored) : {}
  })

  const [isLoading, setIsLoading] = useState(false)
  const [aiScanResults, setAiScanResults] = useState([])

  useEffect(() => {
    localStorage.setItem("govtData_v1", JSON.stringify(rawData))
  }, [rawData])

  useEffect(() => {
    localStorage.setItem("riskThreshold_v1", riskThreshold.toString())
  }, [riskThreshold])

  useEffect(() => {
    localStorage.setItem("auditFeedback_v1", JSON.stringify(auditFeedback))
  }, [auditFeedback])

  useEffect(() => {
    localStorage.setItem("auditStatus_v1", JSON.stringify(auditStatus))
  }, [auditStatus])

  const enrichedData = useMemo(() => {
    return rawData.map(record => ({
      ...record,
      riskScore: record.riskScore,
      riskLevel: record.riskLevel,
      riskReasons: record.riskReasons || [],
      auditStatus: auditStatus[record.id] || "Pending"
    }))
  }, [rawData, auditStatus])

  const filteredHighRiskData = useMemo(() => {
    return enrichedData.filter(record => {
      const isHighScore = record.riskScore >= riskThreshold
      const isMarkedValid = auditFeedback[record.id]?.status === "valid"
      const isMarkedSafe = auditFeedback[record.id]?.status === "false_alarm"
      if (isMarkedSafe) return false
      if (isMarkedValid) return true
      return isHighScore
    })
  }, [enrichedData, riskThreshold, auditFeedback])

  const uploadData = async (file) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!res.ok) throw new Error("Upload failed")

      const records = await res.json()

      const recordsWithIds = records.map(r => ({
        ...r,
        id: r.id || Math.random().toString(36).slice(2),
        auditStatus: "Pending"
      }))

      setRawData(prev => [...prev, ...recordsWithIds])
      setIsLoading(false)

      return { success: true, count: recordsWithIds.length }
    } catch (e) {
      setIsLoading(false)
      return { success: false, error: e.message }
    }
  }

  const markAsValid = (recordId) => {
    const timestamp = new Date().toISOString()
    setAuditFeedback(prev => ({ ...prev, [recordId]: { status: "valid", timestamp } }))
    setAuditStatus(prev => ({ ...prev, [recordId]: "Reviewed" }))
  }

  const markAsFalseAlarm = (recordId) => {
    const timestamp = new Date().toISOString()
    setAuditFeedback(prev => ({ ...prev, [recordId]: { status: "false_alarm", timestamp } }))
    setAuditStatus(prev => ({ ...prev, [recordId]: "Reviewed" }))
  }

  const markAsEscalated = (recordId) => {
    setAuditStatus(prev => ({ ...prev, [recordId]: "Escalated" }))
  }

  const resolveEscalation = (recordId, resolution, notes = "") => {
    const timestamp = new Date().toISOString()
    const status = resolution === "approved" ? "valid" : "false_alarm"

    setAuditFeedback(prev => ({
      ...prev,
      [recordId]: {
        status,
        timestamp,
        resolvedBy: "Admin",
        adminNotes: notes
      }
    }))

    setAuditStatus(prev => ({ ...prev, [recordId]: "Resolved" }))
  }

  const performAIScan = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        import("../data/aiFoundData").then(module => {
          const newFindings = module.aiFoundData
          const uniqueFindings = newFindings.filter(
            f => !rawData.some(r => r.id === f.id)
          )
          setAiScanResults(uniqueFindings)
          resolve(uniqueFindings)
        })
      }, 2500)
    })
  }

  const importAiFindings = (findingsToImport) => {
    const timestamp = new Date().toISOString()
    const findingsArray = Array.isArray(findingsToImport)
      ? findingsToImport
      : [findingsToImport]

    const recordsWithStatus = findingsArray.map(r => ({
      ...r,
      isAiDiscovered: true,
      importedAt: timestamp,
      auditStatus: "Pending"
    }))

    setRawData(prev => [...prev, ...recordsWithStatus])

    const importedIds = new Set(findingsArray.map(f => f.id))
    setAiScanResults(prev => prev.filter(f => !importedIds.has(f.id)))
  }

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all system data to factory defaults?")) {
      localStorage.removeItem("govtData_v1")
      localStorage.removeItem("riskThreshold_v1")
      localStorage.removeItem("auditFeedback_v1")
      localStorage.removeItem("auditStatus_v1")

      setRawData(govtSpendingData)
      setRiskThreshold(75)
      setAuditFeedback({})
      setAuditStatus({})

      setTimeout(() => window.location.reload(), 500)
    }
  }

  const value = {
    rawData,
    enrichedData,
    filteredHighRiskData,
    riskThreshold,
    setRiskThreshold,
    auditFeedback,
    auditStatus,
    uploadData,
    markAsValid,
    markAsFalseAlarm,
    markAsEscalated,
    resolveEscalation,
    performAIScan,
    importAiFindings,
    resetData,
    aiScanResults,
    isLoading
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
