import driver from "../../lib/neo4j";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;
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
