export type EmployeeProperties = {
  employeeId: string;
  name: string;
  talentGroup: string;
  position: string;
  email: string;
  location: string;
  status: string;
  coachName: string | null;
  coachEmployeeId: string;
  coachEmail?: string;
  coachTG?: string,
  coachLocation?: string,
  coachPosition?: string,
  coachStatus?: string,
  coacheeName?: string;
  coacheeId?: string;
  coacheePosition?: string;
  coacheeTG?: string;
  coacheeCount?: number;
};
