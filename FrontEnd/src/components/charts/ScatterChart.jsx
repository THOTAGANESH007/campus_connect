import { Scatter } from "react-chartjs-2";

const ScatterChart = ({ title, points }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <Scatter
      data={{
        datasets: [
          {
            label: "CGPA vs Package",
            data: points,
            backgroundColor: "#3b82f6",
          },
        ],
      }}
      options={{
        scales: {
          x: { title: { display: true, text: "CGPA" } },
          y: { title: { display: true, text: "Package (LPA)" } },
        },
      }}
    />
  </div>
);

export default ScatterChart;
