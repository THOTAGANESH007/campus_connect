// import PieChart from "../../components/charts/PieChart";
import PieChart from "../../charts/PieChart";

import { techDistribution } from "../../data/placementData";

const TechDistribution = () => (
  <PieChart
    title="Technology Distribution"
    labels={techDistribution.map(t => t.tech)}
    data={techDistribution.map(t => t.value)}
  />
);

export default TechDistribution;
