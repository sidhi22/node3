import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";

const DATA_VARIABLE = "id";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session = driver.session();
  const query = `MATCH (e:Employee) RETURN e.employeeId as ${DATA_VARIABLE}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const employeeIds: string[] = records.map((record: Record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(employeeIds);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }
};
