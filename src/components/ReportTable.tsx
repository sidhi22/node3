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
  const { employees } = useEmployees(report.api); // Unfiltered nodes
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
  }, [employees]);

  return (
    <>
      {reportTable && (
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

          <table>
            <thead>
              <tr>
                {reportTable.headers.map((header) => (
                  <th>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportTable.rows.map((row) => (
                <tr>
                  {row.map((value) => (
                    <td>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default ReportTable;
