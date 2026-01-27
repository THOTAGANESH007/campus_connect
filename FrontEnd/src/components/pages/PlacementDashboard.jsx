import DashboardFilters from "../filters/DashboardFilters";
import CompanyPackages from "../features/placementStats/CompanyPackages";
import SelectionRatio from "../features/placementStats/SelectionRatio";
import TechDistribution from "../features/placementStats/TechDistribution";
import YearWiseVisits from "../features/placementStats/YearWiseVisits";
import BranchWiseSelections from "../features/placementStats/BranchWiseSelections";
import CGPACutoff from "../features/placementStats/CGPACutoff";
import RoundDifficulty from "../features/placementStats/RoundDifficulty";

const PlacementDashboard = () => (
  <div className="p-6 bg-gray-100 min-h-screen space-y-6">
    <h1 className="text-3xl font-bold">Placement Statistics Dashboard</h1>

    <DashboardFilters />

    <CompanyPackages />

    <div className="grid md:grid-cols-2 gap-6">
      <SelectionRatio />
      <TechDistribution />
      <YearWiseVisits />
      <BranchWiseSelections />
      <CGPACutoff />
      <RoundDifficulty />
    </div>
  </div>
);

export default PlacementDashboard;
