export type Report = {
  label: string;
  api: string;
  headers: string[];
};

export type Reports = {
  noCoach: Report;
  coachNotCBO: Report;
  underCoaching: Report;
  overCoaching: Report;
  geoMismatch: Report;
  tgMismatch: Report;
  tgAndGeoMismatch: Report;
  highSeniorityGap: Report;
};

export type RowData = Array<string | number>;

export type ReportData = {
  headers: string[];
  rows: RowData[];
};
