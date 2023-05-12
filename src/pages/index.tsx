import { useState, useEffect } from "react";
import Neo4jGraph from "../components/Neo4jGraphWrapper";
import Link from "next/link";
import { Neo4jData } from "@/types/neo4j";

const App = () => {
  const [neo4jData, setNeo4jData] = useState<Neo4jData>({
    nodes: [],
    relationships: [],
  });

  useEffect(() => {
    const fetchDataFromNeo4j = async () => {
      const nodesDataRes = await fetch(`/api/get-nodes`);
      const relationshipsDataRes = await fetch(`/api/get-relationships`);

      const nodesData = await nodesDataRes.json();
      const relationships = await relationshipsDataRes.json();
      setNeo4jData({
        nodes: nodesData,
        relationships: relationships,
      });
    };

    fetchDataFromNeo4j();
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Coaching Tree</h1>
        <div className="button-container">
          <button disabled>Upload Data</button>
          <Link href="/reports">
            <button>Generate Report</button>
          </Link>
        </div>
      </div>
      <Neo4jGraph neo4jData={neo4jData} />
    </div>
  );
};

export default App;
