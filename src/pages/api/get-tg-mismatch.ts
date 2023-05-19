import { Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { getRecords } from "@/services/db-service";

const EMPLOYEE_VAR = "employee";
const COACH_VAR = "coach";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (c:Employee)-[:COACHING]->(p:Employee)
    WHERE c.talentGroup <> p.talentGroup
    RETURN p as ${EMPLOYEE_VAR}, c as ${COACH_VAR}`;

  try {
    const records: Record[] = await getRecords(query);
    const employees: EmployeeNode[] = records.map((record) => {
      const employee: EmployeeNode = record.get(EMPLOYEE_VAR);
      const coach: EmployeeNode = record.get(COACH_VAR);
      employee.properties.coachName = coach.properties.name;
      employee.properties.coachEmail = coach.properties.email;
      employee.properties.coachTG = coach.properties.talentGroup;
      employee.properties.coachLocation = coach.properties.location;
      employee.properties.coachPosition = coach.properties.position;
      employee.properties.coachStatus = coach.properties.status;
      return employee;
    });
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
  }
};
