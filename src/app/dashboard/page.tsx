import DashboardShell from "@/components/common/DashboardShell";
import Overview from "@/components/pages/dashboard/Overview";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <Overview />
    </DashboardShell>
  );
}