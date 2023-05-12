// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";
import { Query } from "neo4j-driver-core/types/types";
import { POSITION_LEVELS } from "@/constants/employee-fields";
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

type Data = {
  name: string;
};

export default async (req: NextApiRequest, response: NextApiResponse<Data>) => {
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  );
  // 1. Open a session
  const session = driver.session();

  try {
    const cypher: Query = `MATCH (c:Employee)-[:COACHING]->(p:Employee) RETURN collect(c) as coaches, collect(p) as employees`;
    const params: {} = {};
    // 2. Execute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());
    const coaches = [];
    for (let i = 0; i < values[0].coaches.length; i++) {
      if (
        Math.abs(
          POSITION_LEVELS[values[0].employees[i].properties.Position_Name] -
            POSITION_LEVELS[values[0].coaches[i].properties.Position_Name]
        ) > 1
      ) {
        values[0].coaches[i].properties["Coachee_Name"] = values[0].employees[i].properties.Preferred_Full_Name
        values[0].coaches[i].properties["Coachee_ID"] = values[0].employees[i].properties.Employee_ID
        values[0].coaches[i].properties["Coachee_Position"] = values[0].employees[i].properties.Position_Name
        values[0].coaches[i].properties["Coachee_TG"] = values[0].employees[i].properties.Talent_Group
        coaches.push(values[0].coaches[i])
      }
    }

    response.status(200).json(coaches);
    // return values
  } finally {
    // 4. Close the session
    await session.close();
  }
};
