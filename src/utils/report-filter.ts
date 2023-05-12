import { EmployeeNode } from "@/types/neo4j";

function inTalentGroup(node: EmployeeNode, talentGroup: string) {
  if (talentGroup == "All" || node.properties.talentGroup == talentGroup) {
    return true;
  }
  return false;
}

function inLocation(node: EmployeeNode, location: string) {
  if (location == "All" || node.properties.location == location) {
    return true;
  }
  return false;
}

function filterPartner(node: EmployeeNode, partnerFilter: boolean) {
  if (!partnerFilter || node.properties.position != "Partner") {
    return true;
  }
  return false;
}

export default function filterReport(
  data: EmployeeNode[],
  talentGroupFilter: string,
  locationFilter: string,
  partnerFilter: boolean
): EmployeeNode[] {
  const filteredData: EmployeeNode[] = [];
  data.forEach((item) => {
    if (
      inTalentGroup(item, talentGroupFilter) &&
      inLocation(item, locationFilter) &&
      filterPartner(item, partnerFilter)
    ) {
      filteredData.push(item);
    }
  });

  return filteredData;
}
