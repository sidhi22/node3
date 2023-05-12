// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { POSITION_LEVELS } from "@/constants/employee-fields";
import neo4j from "neo4j-driver";
import { Query } from "neo4j-driver-core/types/types";
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

type Data = {
  name: string;
};

//Coaches with less than 5 Coachees
export default async (req: NextApiRequest, response: NextApiResponse<Data>) => {
  var seniorPositions = "[";
  for (const key in POSITION_LEVELS) {
    if (Object.prototype.hasOwnProperty.call(POSITION_LEVELS, key) && POSITION_LEVELS[key] > 0) {
      seniorPositions += `"${key}",`;
    }
  }
  seniorPositions = seniorPositions.slice(0, -1)  // Remove last comma from string 
  seniorPositions += "]"

  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  );
  // 1. Open a session
  const session = driver.session();

  try {
    const cypher: Query = `MATCH (p:Employee)
    WHERE p.Position_Name IN ${seniorPositions}
    WITH p, size([(p)-[:COACHING]->(c) WHERE c:Employee | 1]) AS coacheeCount
    WHERE coacheeCount < 2
    RETURN collect(p) as employees, collect(coacheeCount) as coacheesCount`;
    const params: {} = {};
    // 2. Execute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());
    for (let i = 0; i < values[0].employees.length; i++) {
      values[0].employees[i].properties["Coachees_Count"] = parseInt(
        values[0].coacheesCount[i]
      );
    }
    response
      .status(200)
      .json(
        values[0].employees.sort(
          (employeeA, employeeB) =>
            employeeA.properties.Coachees_Count -
            employeeB.properties.Coachees_Count
        )
      );
    // return values
  } finally {
    // 4. Close the session
    await session.close();
  }
};
