import { Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { getRecords } from "@/services/db-service";

const EMPLOYEE_VAR = "employee";
const COUNT_VAR = "coacheeCount";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (p:Employee)
    WITH p, size([(p)-[:COACHING]->(c) WHERE c:Employee | 1]) AS count
    WHERE count > 5
    RETURN p as ${EMPLOYEE_VAR}, count as ${COUNT_VAR}`;

  try {
    const records: Record[] = await getRecords(query);
    const employees: EmployeeNode[] = [];
    records.map((record) => {
      const employee: EmployeeNode = record.get(EMPLOYEE_VAR);
      employee.properties.coacheeCount = parseInt(record.get(COUNT_VAR));
      employees.push(employee);
    });
    res
      .status(200)
      .json(
        employees.sort(
          (a, b) =>
            (b.properties.coacheeCount as number) -
            (a.properties.coacheeCount as number)
        )
      );
  } catch (error) {
    console.log(error);
  }
};
