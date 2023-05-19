import { Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { getRecords } from "@/services/db-service";

const DATA_VARIABLE = "employees";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (n) RETURN n as ${DATA_VARIABLE}`;
  try {
    const records: Record[] = await getRecords(query);
    const employeeNodes: EmployeeNode[] = records.map((record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(employeeNodes);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
  }
};
