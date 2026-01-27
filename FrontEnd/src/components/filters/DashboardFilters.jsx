const DashboardFilters = () => (
  <div className="flex gap-4">
    <select className="border p-2 rounded">
      <option>All Years</option>
      <option>2023</option>
      <option>2022</option>
    </select>
    <select className="border p-2 rounded">
      <option>All Branches</option>
      <option>CSE</option>
      <option>IT</option>
    </select>
  </div>
);

export default DashboardFilters;
