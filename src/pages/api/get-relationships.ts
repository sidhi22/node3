import { Record, Relationship } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { getRecords } from "@/services/db-service";

const DATA_VARIABLE = "relationships";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (n)-[r]->(m) RETURN r as ${DATA_VARIABLE}`;

  try {
    const records: Record[] = await getRecords(query);
    const coachingRelationships: Relationship[] = records.map((record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(coachingRelationships);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
  }
};
