// import HeatMap from "../../components/charts/HeatMap";
import HeatMap from "../../charts/HeatMap";

import { roundDifficulty } from "../../data/placementData";

const RoundDifficulty = () => (
  <HeatMap title="Round-wise Difficulty" data={roundDifficulty} />
);

export default RoundDifficulty;
