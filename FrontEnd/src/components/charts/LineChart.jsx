import { Line } from "react-chartjs-2";

const LineChart = ({ title, labels, datasets }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <Line data={{ labels, datasets }} />
  </div>
);

export default LineChart;
