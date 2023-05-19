import { Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { getRecords } from "@/services/db-service";
import { POSITION_LEVELS } from "@/constants/employee-fields";

const EMPLOYEE_VAR = "employee";
const COUNT_VAR = "count";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (p:Employee)
    WITH p, size([(p)-[:COACHING]->(c) WHERE c:Employee | 1]) AS count
    WHERE count < 2
    RETURN p as ${EMPLOYEE_VAR}, count as ${COUNT_VAR}`;

  try {
    const records: Record[] = await getRecords(query);
    const employees: EmployeeNode[] = [];
    records.forEach((record) => {
      const employee: EmployeeNode = record.get(EMPLOYEE_VAR);
      if (POSITION_LEVELS[employee.properties.position] > 0) {
        employee.properties.coacheeCount = parseInt(record.get(COUNT_VAR));
        employees.push(employee);
      }
    });
    res
      .status(200)
      .json(
        employees.sort(
          (a, b) =>
            (a.properties.coacheeCount as number) -
            (b.properties.coacheeCount as number)
        )
      );
  } catch (error) {
    console.log(error);
  }
};
