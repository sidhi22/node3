import dynamic from "next/dynamic";

const Neo4jGraph = dynamic(() => import("./Neo4jGraph"), {
  ssr: false
});

export default Neo4jGraph;
