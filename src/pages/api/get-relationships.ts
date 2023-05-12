import driver from "../../lib/neo4j";
import { QueryResult, Session, Record, Relationship } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";

const DATA_VARIABLE = "relationships";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session = driver.session();
  const query = `MATCH (n)-[r]->(m) RETURN r as ${DATA_VARIABLE}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const coachingRelationships: Relationship[] = records.map((record) =>
      record.get(DATA_VARIABLE)
    );
    res.status(200).json(coachingRelationships);
  } catch (error) {
    // TODO: Error Handling
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }
};
