// import BarChart from "../../components/charts/BarChart";
import BarChart from "../../charts/BarChart";

import { selectionRatio } from "../../data/placementData";

const SelectionRatio = () => (
  <BarChart
    title="Selection Ratio"
    labels={selectionRatio.map(s => s.stage)}
    datasets={[
      {
        label: "Students",
        data: selectionRatio.map(s => s.count),
        backgroundColor: "#f97316",
      },
    ]}
  />
);

export default SelectionRatio;
