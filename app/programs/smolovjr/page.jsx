import WorkoutHeader from "@/components/workout/WorkoutHeader";
import { verifySessionForRequests } from "@/lib/session";
import { redirect } from "next/navigation";
import WorkoutContainer from "@/components/smolovjr/WorkoutContainer";
import { getSmolovData } from "@/lib/smolovActions";

export default async function SmolovJrPage() {
  // Verify session
  const session = await verifySessionForRequests();
  if (!session) {
    redirect('/login');
  }

  // Fetch or initialize Smolov Jr data from DB for the authenticated user
  const smolovResponse = await getSmolovData(session.user.id);
  const smolovData = smolovResponse?.data || {
    unit: 'lbs',
    activeMovement: 'back-squat',
    backSquat: { current1RM: 0, previous1RM: 0, weeklyJump: 10, completedDays: [] },
    benchPress: { current1RM: 0, previous1RM: 0, weeklyJump: 5, completedDays: [] },
  };

  return (
    <div className="min-h-screen pb-20">
      <WorkoutHeader session={session} />
      <WorkoutContainer initialData={smolovData} />
    </div>
  );
}