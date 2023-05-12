export default function generateCSVName(activeTab, locationFilter, talentGroupFilter, partnerFilter) {
  var fileName = `Report for ${activeTab}`

  if (locationFilter != "All") {
    fileName += ` in ${locationFilter}`
  }

  if (talentGroupFilter != "All") {
    fileName += ` and in ${talentGroupFilter}`
  }

  if (partnerFilter) {
    fileName += " excluding Partners"
  }

  return fileName
}