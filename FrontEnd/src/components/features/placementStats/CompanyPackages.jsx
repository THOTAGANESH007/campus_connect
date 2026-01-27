import BarChart from "../../charts/BarChart";
import { companyPackages } from "../../data/placementData";

const CompanyPackages = () => (
  <BarChart
    title="Company-wise Packages"
    labels={companyPackages.map(c => c.company)}
    datasets={[
      {
        label: "Avg Package",
        data: companyPackages.map(c => c.avg),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Highest Package",
        data: companyPackages.map(c => c.highest),
        backgroundColor: "#22c55e",
      },
    ]}
  />
);

export default CompanyPackages;
