import { useAuth } from "../../context/AuthContext";
import StudentProfile from "./StudentProfile";
import PlacementOfficerProfile from "./PlacementOfficerProfile";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "PLACEMENT_OFFICER" || user.role === "ADMIN") {
    return <PlacementOfficerProfile />;
  }

  return <StudentProfile />;
}
