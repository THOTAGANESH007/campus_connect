// import ScatterChart from "../../components/charts/ScatterChart";
import ScatterChart from "../../charts/ScatterChart";

import { cgpaData } from "../../data/placementData";

const CGPACutoff = () => (
  <ScatterChart title="CGPA vs Package" points={cgpaData} />
);

export default CGPACutoff;
