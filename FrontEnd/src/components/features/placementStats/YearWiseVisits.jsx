// import LineChart from "../../components/charts/LineChart";
import LineChart from "../../charts/LineChart";

import { yearWiseVisits } from "../../data/placementData";

const YearWiseVisits = () => (
  <LineChart
    title="Year-wise Company Visits"
    labels={yearWiseVisits.map(y => y.year)}
    datasets={[
      {
        label: "Companies",
        data: yearWiseVisits.map(y => y.companies),
        borderColor: "#3b82f6",
      },
    ]}
  />
);

export default YearWiseVisits;
