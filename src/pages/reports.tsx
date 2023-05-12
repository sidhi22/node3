import Head from "next/head";
import ReportTable from "@/components/ReportTable";
import { Report } from "@/types/report";
import { useState } from "react";
import { useRouter } from "next/router";
import { reports } from "@/data/reports";
import FilterContext from "@/context/filter";
import { TG_FILTERS, GEO_FILTERS } from "@/constants/report";

export default function Reports() {
  const router = useRouter();
  const [currentReport, setCurrentReport] = useState<Report | undefined>();
  const [tgFilter, setTalentGroupFilter] = useState<string>(TG_FILTERS[0]);
  const [geoFilter, setGeoFilter] = useState<string>(GEO_FILTERS[0]);
  const [partnerFilter, setPartnerFilter] = useState<boolean>(false);

  const setTab = (newReport: Report) => {
    if (currentReport) {
      // If new tab pressed, remove highlight from old tab
      var activeTabElement = document.getElementById(currentReport.label);
      if (activeTabElement) {
        activeTabElement.className = activeTabElement.className.replace(
          " active",
          ""
        );
      }
    }

    var newTabElement = document.getElementById(newReport.label);
    if (newTabElement) {
      newTabElement.className += " active";
    }

    setCurrentReport(newReport);
  };

  return (
    <>
      <Head>
        <title>Generate Report</title>
        <meta name="description" content="generate report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button onClick={() => router.push("/")}>Home</button>
        <div className="flex-container">
          <h1>Coaching Report</h1>
        </div>

        <div className="flex-container">
          <div>
            <label htmlFor="talentGroupFilter">Talent Group:</label>
            <select
              id="talentGroupFilter"
              value={tgFilter}
              onChange={(event) => setTalentGroupFilter(event.target.value)}
            >
              {TG_FILTERS.map((filter) => (
                <option value={filter}>{filter}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="locationFilter">Location:</label>
            <select
              id="locationFilter"
              value={geoFilter}
              onChange={(event) => setGeoFilter(event.target.value)}
            >
              {GEO_FILTERS.map((filter) => (
                <option value={filter}>{filter}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="partnerFilter">Filter out partners:</label>
            <input
              id="partnerFilter"
              type="checkbox"
              checked={partnerFilter}
              onChange={() =>
                setPartnerFilter((partnerFilter) => !partnerFilter)
              }
            />
          </div>
        </div>

        <div className="flex-container" id="tabs">
          {Object.values(reports).map((report, index) => (
            <button
              key={index}
              className="tab-button"
              id={report.label}
              onClick={() => setTab(report)}
            >
              {report.label}
            </button>
          ))}
        </div>
        {currentReport && (
          <FilterContext.Provider
            value={{ tgFilter, geoFilter, partnerFilter }}
          >
            <ReportTable report={currentReport} />
          </FilterContext.Provider>
        )}
      </main>
    </>
  );
}
