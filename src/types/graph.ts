export type NodeProperties = {
  [key: string]: {
    label: string;
    employeeId: string;
    talentGroup: string;
    location: string;
    position: string;
    coachName: string | null;
    coachEmployeeId: string;
  };
};

export type NodeIdMapper = {
  [key: string]: string;
};

export type NodeDegrees = {
  [key: string]: number;
};
