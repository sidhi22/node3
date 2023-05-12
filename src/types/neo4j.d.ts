import { Node, Relationship, Integer } from "neo4j-driver";
import { EmployeeProperties } from "./employee";

export type EmployeeNode = Node<Integer, EmployeeProperties>;

export type Neo4jData = {
  nodes: EmployeeNode[];
  relationships: Relationship[];
};
