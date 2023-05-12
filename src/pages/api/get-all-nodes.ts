import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";

const DATA_VARIABLE = "nodes"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (n) RETURN collect(n) as ${DATA_VARIABLE}`;
  const session: Session = driver.session();
  try {
    const result: QueryResult = await session.run(query);
    const record: Record = result.records[0];
    const employeeNodes: [EmployeeNode] = record.get(DATA_VARIABLE)
    res.status(200).json(employeeNodes);
  } catch (error) {
    // TODO: Error Handling
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }
};
