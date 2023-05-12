import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";

const DATA_VARIABLE = "employee";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session = driver.session();
  const query = `MATCH (p:Employee) WHERE p.Coach IS NULL 
    RETURN p as ${DATA_VARIABLE}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const employees: EmployeeNode[] = records.map((record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(employees);
    // return values
  } finally {
    // 4. Close the session
    await session.close();
  }
};
