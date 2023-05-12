// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import neo4j from 'neo4j-driver';
import { Query } from 'neo4j-driver-core/types/types';
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env

type Data = {
    name: string
}


//Coaches in a different location
export default async (
    req: NextApiRequest,
    response: NextApiResponse<Data>
  ) => {
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(
      NEO4J_USERNAME,
      NEO4J_PASSWORD
    )
  )
  // 1. Open a session
  const session = driver.session()

  try {
    const cypher: Query = `MATCH (c:Employee)-[:COACHING]->(p:Employee)
    WHERE p.Location_Name <> c.Location_Name AND p.Talent_Group <> c.Talent_Group
    RETURN collect(p) as employees, collect(c) as coaches`;
    const params: {} = {};
    // 2. Execute a Cypher Statement
    const res = await session.executeRead(tx => tx.run(cypher, params))

    // 3. Process the Results
    const values = res.records.map(record => record.toObject())
    for (let i = 0; i < values[0].employees.length; i++) {
      values[0].employees[i].properties["Coach_Name"] =
        values[0].coaches[i].properties.Preferred_Full_Name;
      values[0].employees[i].properties["Coach_Email"] =
        values[0].coaches[i].properties.Business_Email_Information_Email_Address;
      values[0].employees[i].properties["Coach_Talent_Group"] =
        values[0].coaches[i].properties.Talent_Group;
      values[0].employees[i].properties["Coach_Location"] =
        values[0].coaches[i].properties.Location_Name;
      values[0].employees[i].properties["Coach_Position"] =
        values[0].coaches[i].properties.Position_Name;
      values[0].employees[i].properties["Coach_Status"] =
        values[0].coaches[i].properties.Employee_Status;
    }
    response.status(200).json(values[0].employees)
    // return values
  }
  finally {
      // 4. Close the session 
      await session.close()
  }
}