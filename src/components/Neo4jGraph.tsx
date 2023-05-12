// components/Neo4jGraph.js
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Relationship } from "neo4j-driver";
import ForceGraph2D, {
  ForceGraphMethods,
  GraphData,
  NodeObject,
  LinkObject,
} from "react-force-graph-2d";
import NodeSearchBox from "./NodeSearchBox";
import getNodeColor from "@/utils/node-colors";
import { POSITION_LEVELS, TALENT_GROUPS } from "@/constants/employee-fields";
import { NODE_SIZE, NODE_COLORS } from "@/constants/node-graph";
import { Neo4jData, EmployeeNode } from "@/types/neo4j";
import { NodeProperties, NodeIdMapper, NodeDegrees } from "@/types/graph";

interface Neo4jGraphProps {
  neo4jData: Neo4jData;
}

const Neo4jGraph = ({ neo4jData }: Neo4jGraphProps) => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [nodeDegrees, setNodeDegrees] = useState<NodeDegrees>({});
  const [nodeColorMap, setNodeColorMap] = useState<NodeIdMapper>({});
  const [nodeProperties, setNodeProperties] = useState<NodeProperties>({});
  const [nodesWithoutLink, setNodesWithoutLink] = useState<Set<string>>(
    new Set<string>()
  );
  const [focusNode, setFocusNode] = useState<NodeObject | null>(null);
  const [talentGroupFilter, setTalentGroupFilter] = useState<string>("All");
  const forceGraphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const router = useRouter();

  const searchCallback = (resultNode: NodeObject) => {
    if (forceGraphRef.current && resultNode) {
      forceGraphRef.current.centerAt(resultNode.x, resultNode.y, 1000);
      forceGraphRef.current.zoom(3, 3000);
    }
    setFocusNode(resultNode);
  };

  // Loop through all node data and populate maps (for dictionary-like quick lookup)
  useEffect(() => {
    if (neo4jData) {
      const degrees: { [key: string]: number } = {};
      const nodePropertiesDict: NodeProperties = {};
      const nodesWithoutLinkSet: Set<string> = new Set<string>();

      // Loop through relationships to obtain degrees of each node
      neo4jData.relationships.forEach((relationship: Relationship) => {
        const sourceNodeId = JSON.stringify(relationship.start);
        const targetNodeId = JSON.stringify(relationship.end);
        degrees[sourceNodeId] = (degrees[sourceNodeId] || 0) + 1;
        if (typeof degrees[targetNodeId] === "undefined") {
          // Initiate target node degree as 0 if it does not have a degree yet
          degrees[targetNodeId] = 0;
        }
      });

      // Loop through nodes to save properties and find nodes without links
      neo4jData.nodes.forEach((node: EmployeeNode) => {
        const nodeId = JSON.stringify(node.identity);
        nodePropertiesDict[nodeId] = {
          label: node.properties.name,
          employeeId: node.properties.employeeId,
          talentGroup: node.properties.talentGroup,
          location: node.properties.location,
          position: node.properties.position,
          coachName: node.properties.coachName,
          coachEmployeeId: node.properties.coachEmployeeId,
        };
        // Save nodes without links
        if (typeof degrees[nodeId] === "undefined") {
          // Node does not have a relationship
          nodesWithoutLinkSet.add(nodeId);
        }
      });
      setNodeDegrees(degrees);
      setNodeProperties(nodePropertiesDict);
      setNodesWithoutLink(nodesWithoutLinkSet);
    }
  }, [neo4jData]);

  // Create data for force graph
  useEffect(() => {
    if (Object.keys(nodeProperties).length > 0) {
      const nodes: NodeObject[] = [];
      const links: LinkObject[] = [];
      const colorMap: NodeIdMapper = {};
      const graphNodeSet: Set<string> = new Set<string>(); // Track nodes in graph
      // Populate nodes
      neo4jData.nodes.forEach((node: EmployeeNode) => {
        if (
          talentGroupFilter == "All" ||
          talentGroupFilter == node.properties.talentGroup
        ) {
          const nodeId = JSON.stringify(node.identity);
          nodes.push({ id: nodeId });
          graphNodeSet.add(nodeId);
          colorMap[nodeId] = getNodeColor(
            talentGroupFilter,
            nodeId,
            nodeDegrees,
            nodeProperties
          );
        }
      });

      // Populate links, adding extra layer of nodes outside of filtered talent group
      neo4jData.relationships.forEach((relationship: Relationship) => {
        const sourceNodeId = JSON.stringify(relationship.start);
        const targetNodeId = JSON.stringify(relationship.end);
        // If link contains node in filter, add to visual
        if (talentGroupFilter == "All") {
          // Filter not applied
          links.push({
            source: sourceNodeId,
            target: targetNodeId,
          });
        } else if (
          nodeProperties[sourceNodeId].talentGroup == talentGroupFilter ||
          nodeProperties[targetNodeId].talentGroup == talentGroupFilter
        ) {
          // If one node in relationship satisfy filter
          links.push({
            source: sourceNodeId,
            target: targetNodeId,
          });

          // Add coach outside of talent group if not added already
          if (
            nodeProperties[sourceNodeId].talentGroup != talentGroupFilter &&
            !graphNodeSet.has(sourceNodeId)
          ) {
            nodes.push({ id: sourceNodeId });
            graphNodeSet.add(sourceNodeId);
            colorMap[sourceNodeId] = getNodeColor(
              talentGroupFilter,
              sourceNodeId,
              nodeDegrees,
              nodeProperties
            );
          }

          // Add coachee outside of talent group
          if (
            nodeProperties[targetNodeId].talentGroup != talentGroupFilter &&
            !graphNodeSet.has(targetNodeId)
          ) {
            nodes.push({ id: targetNodeId });
            graphNodeSet.add(targetNodeId);
            colorMap[targetNodeId] = getNodeColor(
              talentGroupFilter,
              targetNodeId,
              nodeDegrees,
              nodeProperties
            );
          }
        }
      });

      // Create nodes and links for coaches that are not in the data
      nodesWithoutLink.forEach((value) => {
        if (
          (nodeProperties[value].coachName && talentGroupFilter == "All") ||
          nodeProperties[value].talentGroup == talentGroupFilter
        ) {
          const coachId = nodeProperties[value].coachEmployeeId;
          // TODO: here we are using a different format of id - may cause future error
          nodes.push({ id: coachId });
          links.push({
            source: coachId,
            target: value,
          });
          colorMap[coachId] = NODE_COLORS.outsideCBO;
        }
      });
      setGraphData({ nodes, links });
      setNodeColorMap(colorMap);
    }
  }, [nodeDegrees, nodesWithoutLink, nodeProperties, talentGroupFilter]);

  if (graphData.nodes.length != 0 && graphData.links.length != 0) {
    return (
      <>
        <div className="flex-container">
          <NodeSearchBox
            nodes={graphData.nodes}
            properties={nodeProperties}
            searchCallback={searchCallback}
          />
          <div>
            <label htmlFor="talentGroupFilter">Talent Group:</label>
            <select
              id="talentGroupFilter"
              value={talentGroupFilter}
              onChange={(event) => setTalentGroupFilter(event.target.value)}
            >
              {TALENT_GROUPS.map((filterValue) => (
                <option value={filterValue}>{filterValue}</option>
              ))}
            </select>
          </div>
        </div>
        <ForceGraph2D
          ref={forceGraphRef}
          graphData={graphData}
          nodeLabel={(node: NodeObject) => {
            const nodeId: string = node.id as string;
            if (nodeProperties[nodeId]) {
              return `${nodeProperties[nodeId].label} (${nodeProperties[nodeId].position}, ${nodeProperties[nodeId].talentGroup}, ${nodeProperties[nodeId].location})`;
            }
            return `${nodeProperties[nodeId]} (No data for employee)`;
          }}
          nodeColor={(node: NodeObject) => {
            const nodeId = node.id;
            if (nodeId && nodeColorMap[nodeId]) {
              return nodeColorMap[nodeId];
            }
            return "";
          }}
          linkColor={(link: LinkObject) => {
            const sourceProperties = nodeProperties[link.source as string];
            const targetProperties = nodeProperties[link.target as string];
            if (sourceProperties && targetProperties) {
              return Math.abs(
                POSITION_LEVELS[sourceProperties.position] -
                  POSITION_LEVELS[targetProperties.position]
              ) > 1
                ? "pink"
                : "";
            } else {
              return "";
            }
          }}
          nodeRelSize={10}
          linkDirectionalArrowLength={10}
          linkDirectionalArrowRelPos={1}
          onNodeDragEnd={(node) => {
            node.fx = node.x;
            node.fy = node.y;
          }}
          onNodeClick={(node: NodeObject) => {
            const employeeId = nodeProperties[node.id as string].employeeId;
            router.push(`/profile/${employeeId}`);
          }}
          nodeCanvasObject={(node: NodeObject, ctx) => {
            if (node == focusNode) {
              ctx.beginPath();
              ctx.arc(
                node.x as number,
                node.y as number,
                NODE_SIZE * 1.4,
                0,
                2 * Math.PI,
                false
              );
              ctx.fillStyle = "orange";
              ctx.fill();
            }
          }}
          nodeCanvasObjectMode={(node) => node == focusNode && "before"}
        />
      </>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};

export default Neo4jGraph;
