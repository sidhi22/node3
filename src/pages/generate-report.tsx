import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import reportFilter from "@/utils/report-filter";
import generateCSVName from "@/utils/generate-csv-name";
import { CSVLink } from "react-csv";

const tableHeaders = {
  "No Coach": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
  ],
  "Coach not in CBO": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Coach",
      key: "Coach",
    },
  ],
  "Under Coaching": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Number of coachees",
      key: "Coachees_Count",
    },
  ],
  "Over Coaching": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Number of coachees",
      key: "Coachees_Count",
    },
  ],
  "Geography Mismatch": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Coach",
      key: "Coach_Name",
    },
    {
      header: "Coach email",
      key: "Coach_Email",
    },
    {
      header: "Coach talent group",
      key: "Coach_Talent_Group",
    },
    {
      header: "Coach location",
      key: "Coach_Location",
    },
    {
      header: "Coach position",
      key: "Coach_Position",
    },
    {
      header: "Coach status",
      key: "Coach_Status",
    },
  ],
  "Talent Group Mismatch": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Coach",
      key: "Coach_Name",
    },
    {
      header: "Coach email",
      key: "Coach_Email",
    },
    {
      header: "Coach talent group",
      key: "Coach_Talent_Group",
    },
    {
      header: "Coach location",
      key: "Coach_Location",
    },
    {
      header: "Coach position",
      key: "Coach_Position",
    },
    {
      header: "Coach status",
      key: "Coach_Status",
    },
  ],
  "Geography and Talent Mismatch": [
    {
      header: "Name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Talent group",
      key: "Talent_Group",
    },
    {
      header: "Position",
      key: "Position_Name",
    },
    {
      header: "Location",
      key: "Location_Name",
    },
    {
      header: "Email",
      key: "Business_Email_Information_Email_Address",
    },
    {
      header: "Status",
      key: "Employee_Status",
    },
    {
      header: "Coach",
      key: "Coach_Name",
    },
    {
      header: "Coach email",
      key: "Coach_Email",
    },
    {
      header: "Coach talent group",
      key: "Coach_Talent_Group",
    },
    {
      header: "Coach location",
      key: "Coach_Location",
    },
    {
      header: "Coach position",
      key: "Coach_Position",
    },
    {
      header: "Coach status",
      key: "Coach_Status",
    },
  ],
  "High Seniority Gaps": [
    {
      header: "Coach name",
      key: "Preferred_Full_Name",
    },
    {
      header: "Coach position",
      key: "Position_Name",
    },
    {
      header: "Coach talent group",
      key: "Talent_Group",
    },
    {
      header: "Coachee",
      key: "Coachee_Name",
    },
    {
      header: "Coachee position",
      key: "Coachee_Position",
    },
    {
      header: "Coachee talent group",
      key: "Coachee_TG",
    },
  ],
};

const tabValues = [
  "No Coach",
  "Coach not in CBO",
  "Under Coaching",
  "Over Coaching",
  "Geography Mismatch",
  "Talent Group Mismatch",
  "Geography and Talent Mismatch",
  "High Seniority Gaps",
];

const talentGroupFilterValues = [
  "All",
  "Platform & Product Eng",
  "Operations Transformation",
  "Cloud Advisory",
  "Digital Banking",
  "Cross Industry",
  "Quality Eng",
  "Cloud Engineering",
  "Digital Workplace",
  "Operate",
  "Integration Eng",
  "Cloud Security & Network Engineering",
  "Insurance",
];

const locationFilterValues = [
  "All",
  "Melbourne",
  "Sydney",
  "Perth",
  "Brisbane",
  "Canberra",
  "Adelaide",
];

const Home = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [talentGroupFilter, setTalentGroupFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [partnerFilter, setPartnerFilter] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState({
    "geo-mismatch": [],
    "no-coach": [],
    "coach-not-in-CBO": [],
    "not-coaching": [],
    "over-coaching": [],
    "talent-group-mismatch": [],
    "geo-and-talent-mismatch": [],
    "under-coaching": [],
    "all-coaches": [],
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/generate-report`);
      const data = await res.json();
      setAllData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab && allData) {
      if (activeTab == "No Coach") {
        setTableData(
          reportFilter(
            allData["no-coach"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Coach not in CBO") {
        setTableData(
          reportFilter(
            allData["coach-not-in-CBO"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Under Coaching") {
        setTableData(
          reportFilter(
            allData["under-coaching"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Over Coaching") {
        setTableData(
          reportFilter(
            allData["over-coaching"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Geography Mismatch") {
        setTableData(
          reportFilter(
            allData["geo-mismatch"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Talent Group Mismatch") {
        setTableData(
          reportFilter(
            allData["talent-group-mismatch"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "Geography and Talent Mismatch") {
        setTableData(
          reportFilter(
            allData["geo-and-talent-mismatch"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      } else if (activeTab == "High Seniority Gaps") {
        setTableData(
          reportFilter(
            allData["all-coaches"],
            talentGroupFilter,
            locationFilter,
            partnerFilter
          )
        );
      }
    }
  }, [allData, activeTab, talentGroupFilter, locationFilter, partnerFilter]);

  useEffect(() => {
    if (activeTab) {
      setTitleText(`Showing ${tableData.length} results`);
    }
  }, [tableData, activeTab]);

  const setTab = (tabIndex: number) => {
    // If new tab pressed, remove highlight from old tab
    var activeTabElement = document.getElementById(activeTab);
    if (activeTabElement) {
      activeTabElement.className = activeTabElement.className.replace(
        " active",
        ""
      );
    }

    var newTabElement = document.getElementById(tabValues[tabIndex]);
    if (newTabElement) {
      newTabElement.className += " active";
    }

    setActiveTab(tabValues[tabIndex]);
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

          {activeTab && tableData && (
            <CSVLink
              data={tableData.map(({ properties }) =>
                tableHeaders[activeTab].map((header) =>
                  typeof properties[header.key] === "string"
                    ? properties[header.key].replace(/"/g, '""')
                    : properties[header.key]
                )
              )}
              headers={tableHeaders[activeTab].map(
                (headerObj) => headerObj.header
              )}
              filename={generateCSVName(
                activeTab,
                locationFilter,
                talentGroupFilter,
                partnerFilter
              )}
            >
              <button>Download CSV</button>
            </CSVLink>
          )}
        </div>

        <div className="flex-container">
          <div>
            <label htmlFor="talentGroupFilter">Talent Group:</label>
            <select
              id="talentGroupFilter"
              value={talentGroupFilter}
              onChange={(event) => setTalentGroupFilter(event.target.value)}
            >
              {talentGroupFilterValues.map((filterValue) => (
                <option value={filterValue}>{filterValue}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="locationFilter">Location:</label>
            <select
              id="locationFilter"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              {locationFilterValues.map((filterValue) => (
                <option value={filterValue}>{filterValue}</option>
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
          {tabValues.map((tabValue, index) => (
            <button
              key={index}
              className="tab-button"
              id={tabValue}
              onClick={() => setTab(index)}
            >
              {tabValue}
            </button>
          ))}
        </div>
        {activeTab && (
          <>
            <h3>{titleText}</h3>
            <table>
              <thead>
                <tr>
                  {tableHeaders[activeTab].map((headerObj) => (
                    <th>{headerObj.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map(({ properties }) => (
                  <tr>
                    {tableHeaders[activeTab].map(({ header, key }) => (
                      <td>
                        {header == "Email" || header == "Coach email" ? (
                          <a href={`mailto:${properties[key]}`}>
                            {properties[key]}
                          </a>
                        ) : header == "Coach" ? (
                          <a
                            href={`/profile/${properties["Coach_User_Sys_ID"]}`}
                          >
                            {properties[key]}
                          </a>
                        ) : header == "Coachee" ? (
                          <a href={`/profile/${properties["Coachee_ID"]}`}>
                            {properties[key]}
                          </a>
                        ) : (
                          properties[key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
