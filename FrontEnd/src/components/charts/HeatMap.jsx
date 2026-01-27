const HeatMap = ({ title, data }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="grid grid-cols-4 gap-2">
      {data.map((item, i) => (
        <div
          key={i}
          className="text-white text-sm p-2 rounded"
          style={{ backgroundColor: item.color }}
        >
          {item.label}
        </div>
      ))}
    </div>
  </div>
);

export default HeatMap;
