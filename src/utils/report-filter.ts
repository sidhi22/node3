function inTalentGroup(dataObj, talentGroup) {
  if (talentGroup == "All" || dataObj.Talent_Group == talentGroup) {
    return true;
  }
  return false;
}

function inLocation(dataObj, location) {
  if (location == "All" || dataObj.Location_Name == location) {
    return true;
  }
  return false;
}

function filterPartner(dataObj, partnerFilter) {
  if (!partnerFilter || dataObj.Position_Name != "Partner") {
    return true;
  }
  return false;
}

export default function reportFilter(
  data,
  talentGroupFilter,
  locationFilter,
  partnerFilter
) {
  var newData = [];
  data.forEach((item) => {
    if (
      inTalentGroup(item.properties, talentGroupFilter) &&
      inLocation(item.properties, locationFilter) &&
      filterPartner(item.properties, partnerFilter)
    ) {
      newData.push(item);
    }
  });

  return newData;
}
