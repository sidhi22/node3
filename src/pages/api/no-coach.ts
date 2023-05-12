// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";
import { Query } from "neo4j-driver-core/types/types";
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

type Data = {
  name: string;
};

//Employees without a Coach
export default async (req: NextApiRequest, response: NextApiResponse<Data>) => {
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  );
  // 1. Open a session
  const session = driver.session();

  try {
    const cypher: Query = `MATCH (p:Employee) WHERE p.Coach IS NULL RETURN collect(p) as employees`;
    const params: {} = {};
    // 2. Execute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());
    response.status(200).json(values[0].employees);
    // return values
  } finally {
    // 4. Close the session
    await session.close();
  }
};
