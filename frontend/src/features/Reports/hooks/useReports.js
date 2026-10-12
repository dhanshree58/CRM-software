import { useCallback, useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../../../services/api";
import { getReportData } from "../utils/reportUtils";

export default function useReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getReports();
      setReport(response.data);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const reportData = useMemo(
    () => getReportData(report),
    [report]
  );

  return {
    report,
    reportData,
    loading,
    error,
    loadReports,
  };
}