// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import type { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";

const DATA_VARIABLE = "employee";

//Employees without a Coach
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session = driver.session();
  const query = `MATCH (p:Employee) 
    WHERE NOT (p)<-[:COACHING]-() AND p.Coach IS NOT NULL 
    RETURN COLLECT(p) as ${DATA_VARIABLE}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const employeeNode: EmployeeNode = records[0].get(DATA_VARIABLE);
    res.status(200).json(employeeNode);
  } finally {
    // 4. Close the session
    await session.close();
  }
};
