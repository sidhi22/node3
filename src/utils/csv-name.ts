export default function generateCSVName(activeTab: string, locationFilter: string, talentGroupFilter: string, partnerFilter: boolean) {
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