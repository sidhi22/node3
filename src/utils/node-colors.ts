import { NodeProperties, NodeIdMapper, NodeDegrees } from "@/types/graph";
import { NODE_COLORS } from "@/constants/node-graph";
import { POSITION_LEVELS } from "@/constants/employee-fields";

function inTalentGroup(filter: string, talentGroup: string): boolean {
  return filter == "All" || talentGroup == filter;
}

export default function getNodeColor(
  talentGroupFilter: string,
  nodeId: string,
  nodeDegrees: NodeDegrees,
  nodeProperties: NodeProperties
): string {
  const positionLevel: number =
    POSITION_LEVELS[nodeProperties[nodeId].position];
  // Non-senior position levels
  if (positionLevel == 0) {
    return inTalentGroup(talentGroupFilter, nodeProperties[nodeId].talentGroup)
      ? NODE_COLORS.nonSeniorPosition
      : NODE_COLORS.nonSeniorPositionOutsideTG;
  }
  // Senior position levels
  if (nodeDegrees[nodeId] > 5) {
    // Over coaching
    return inTalentGroup(talentGroupFilter, nodeProperties[nodeId].talentGroup)
      ? NODE_COLORS.overCoaching
      : NODE_COLORS.overCoachingOutsideTG;
  } else if (nodeDegrees[nodeId] < 2) {
    // Under coaching
    return inTalentGroup(talentGroupFilter, nodeProperties[nodeId].talentGroup)
      ? NODE_COLORS.underCoaching
      : NODE_COLORS.underCoachingOutsideTG;
  } else {
    return inTalentGroup(talentGroupFilter, nodeProperties[nodeId].talentGroup)
      ? NODE_COLORS.goodAmountCoaching
      : NODE_COLORS.goodAmountCoachingOutsideTG;
  }
}
