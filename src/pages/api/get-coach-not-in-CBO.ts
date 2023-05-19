import { Record } from "neo4j-driver";
import type { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";
import { getRecords } from "@/services/db-service";

const DATA_VARIABLE = "employee";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (p:Employee) 
    WHERE NOT (p)<-[:COACHING]-() AND p.coachName IS NOT NULL 
    RETURN p as ${DATA_VARIABLE}`;

  try {
    const records: Record[] = await getRecords(query);
    const employees: EmployeeNode[] = records.map((record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
  }
};
