import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { CoachingRelationship } from "@/types/neo4j";

const DATA_VARIABLE = "relationships"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `MATCH (n)-[r]->(m) RETURN collect(r) as ${DATA_VARIABLE}`;
  const session: Session = driver.session();
  try {
    const result: QueryResult = await session.run(query);
    const record: Record = result.records[0];
    const coachingRelationships: [CoachingRelationship] = record.get(DATA_VARIABLE)
    res.status(200).json(coachingRelationships);
  } catch (error) {
    // TODO: Error Handling
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }
};
