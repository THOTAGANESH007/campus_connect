import { Pie } from "react-chartjs-2";

const PieChart = ({ title, labels, data }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <Pie
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#3b82f6",
              "#22c55e",
              "#f97316",
              "#a855f7",
            ],
          },
        ],
      }}
    />
  </div>
);

export default PieChart;
