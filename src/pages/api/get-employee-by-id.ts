import driver from "../../lib/neo4j";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const query = `MATCH (e:Employee) WHERE e.Employee_ID = "${id}" RETURN e as employee`;
  const session = driver.session();
  let result;

  try {
    result = await session.run(query);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }

  res.status(200).json(result.records.map((record) => record.toObject()));
};
