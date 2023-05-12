import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { POSITION_LEVELS } from "@/constants/employee-fields";

const EMPLOYEE_VAR = "employees";
const COACH_VAR = "coaches";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session = driver.session();
  const query = `MATCH (c:Employee)-[:COACHING]->(p:Employee) 
  RETURN c as ${COACH_VAR}, p as ${EMPLOYEE_VAR}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const employees: EmployeeNode[] = [];
    records.forEach((record) => {
      const coach: EmployeeNode = record.get(COACH_VAR);
      const employee: EmployeeNode = record.get(EMPLOYEE_VAR);
      if (
        Math.abs(
          POSITION_LEVELS[coach.properties.position] -
            POSITION_LEVELS[employee.properties.position]
        ) > 1
      ) {
        coach.properties.coacheeName = employee.properties.name;
        coach.properties.coacheeId = employee.properties.employeeId;
        coach.properties.coacheePosition = employee.properties.position;
        coach.properties.coacheeTG = employee.properties.talentGroup;
        employees.push(coach);
      }
    });
    res.status(200).json(employees);
    // return values
  } finally {
    // 4. Close the session
    await session.close();
  }
};
