import { EmployeeNode } from "@/types/neo4j";
import { RowData, ReportData } from "@/types/report";
import { HEADERS } from "@/constants/report";
import { reports } from "@/data/reports";

function getCellData(node: EmployeeNode, header: string): string | number {
  switch (header) {
    case HEADERS.employeeName:
      return node.properties.name;
    case HEADERS.talentGroup:
      return node.properties.talentGroup;
    case HEADERS.position:
      return node.properties.position;
    case HEADERS.location:
      return node.properties.location;
    case HEADERS.email:
      return node.properties.email;
    case HEADERS.status:
      return node.properties.status;
    case HEADERS.coachName:
      return node.properties.coachName as string;
    case HEADERS.numberCoachees:
      return node.properties.coacheeCount as number;
    case HEADERS.coachEmail:
      return node.properties.coachEmail as string;
    case HEADERS.coachTG:
      return node.properties.coachTG as string;
    case HEADERS.coachLocation:
      return node.properties.coachLocation as string;
    case HEADERS.coachPosition:
      return node.properties.coachPosition as string;
    case HEADERS.coachStatus:
      return node.properties.coachStatus as string;
    case HEADERS.coacheeName:
      return node.properties.coacheeName as string;
    case HEADERS.coacheePosition:
      return node.properties.coachPosition as string;
    case HEADERS.coachTG:
      return node.properties.coachTG as string;
    default:
      return "";
  }
}

function getRows(
  filteredReportData: EmployeeNode[],
  headers: string[]
): RowData[] {
  return filteredReportData.map((node) =>
    headers.map((header) => getCellData(node, header))
  );
}

export default function getReportTable(
  filteredReportData: EmployeeNode[],
  report: string
): ReportData | null {
  switch (report) {
    case reports.noCoach.label:
      return {
        headers: reports.noCoach.headers,
        rows: getRows(filteredReportData, reports.noCoach.headers),
      };
    case reports.coachNotCBO.label:
      return {
        headers: reports.coachNotCBO.headers,
        rows: getRows(filteredReportData, reports.coachNotCBO.headers),
      };
    case reports.underCoaching.label:
      return {
        headers: reports.underCoaching.headers,
        rows: getRows(filteredReportData, reports.underCoaching.headers),
      };
    case reports.overCoaching.label:
      return {
        headers: reports.overCoaching.headers,
        rows: getRows(filteredReportData, reports.overCoaching.headers),
      };
    case reports.geoMismatch.label:
      return {
        headers: reports.geoMismatch.headers,
        rows: getRows(filteredReportData, reports.overCoaching.headers),
      };
    case reports.tgMismatch.label:
      return {
        headers: reports.tgMismatch.headers,
        rows: getRows(filteredReportData, reports.tgMismatch.headers),
      };
    case reports.tgAndGeoMismatch.label:
      return {
        headers: reports.tgAndGeoMismatch.headers,
        rows: getRows(filteredReportData, reports.tgAndGeoMismatch.headers),
      };
    case reports.highSeniorityGap.label:
      return {
        headers: reports.highSeniorityGap.headers,
        rows: getRows(filteredReportData, reports.highSeniorityGap.headers),
      };
    default:
      return null;
  }
}
