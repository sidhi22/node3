import React, { useState, useEffect, useContext } from "react";
import { CSVLink } from "react-csv";
import useEmployees from "@/hooks/useEmployees";
import getReportTable from "@/utils/report-table";
import { Report, ReportData } from "@/types/report";
import filterReport from "@/utils/report-filter";
import FilterContext from "@/context/filter";
import generateCSVName from "@/utils/csv-name";

interface ReportTableProps {
  report: Report;
}

function ReportTable({ report }: ReportTableProps) {
  const [reportTable, setReportTable] = useState<ReportData | null>();
  const { employees, isLoading, isError } = useEmployees(report.api); // Unfiltered nodes
  const { tgFilter, geoFilter, partnerFilter } = useContext(FilterContext);

  useEffect(() => {
    if (employees) {
      setReportTable(
        getReportTable(
          filterReport(employees, tgFilter, geoFilter, partnerFilter),
          report.label
        )
      );
    }
  }, [employees, tgFilter, geoFilter, partnerFilter]);

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <h1>Error loading data</h1>
      ) : (
        reportTable && (
          <>
            <CSVLink
              data={reportTable.rows.map((row) =>
                row.map((value) =>
                  typeof value === "string" ? value.replace(/"/g, '""') : value
                )
              )}
              headers={reportTable.headers}
              filename={generateCSVName(
                report.label,
                geoFilter,
                tgFilter,
                partnerFilter
              )}
            >
              <button>Download CSV</button>
            </CSVLink>
            <h1>Showing {reportTable.rows.length} results</h1>
            <table>
              <thead>
                <tr>
                  {reportTable.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportTable.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      )}
    </>
  );
}

export default ReportTable;
