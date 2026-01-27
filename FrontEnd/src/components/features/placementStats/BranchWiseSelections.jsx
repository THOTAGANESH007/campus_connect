// import BarChart from "../../components/charts/BarChart";
import BarChart from "../../charts/BarChart";

import { branchSelections } from "../../data/placementData";

const BranchWiseSelections = () => (
  <BarChart
    title="Branch-wise Selections"
    labels={branchSelections.map(b => b.branch)}
    datasets={[
      {
        label: "Selected Students",
        data: branchSelections.map(b => b.selected),
        backgroundColor: "#a855f7",
      },
    ]}
  />
);

export default BranchWiseSelections;
