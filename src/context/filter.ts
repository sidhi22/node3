import { createContext } from "react";
import { TG_FILTERS, GEO_FILTERS } from "@/constants/report";

const FilterContext = createContext({
  tgFilter: TG_FILTERS[0],
  geoFilter: GEO_FILTERS[0],
  partnerFilter: false,
});

export default FilterContext;
