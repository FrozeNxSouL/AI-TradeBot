import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <div className="fixed flex flex-col h-screen w-1/5 bg-background px-12 py-16 opacity-95">
        <p className="font-semibold text-lg text-foreground uppercase">
          <Link color="primary" className="hover:text-foreground" href="/dashboard/">
            Dashboard
          </Link>
        </p>
        <Divider className="my-4 bg-foreground" />
        <div className="flex flex-col w-full gap-2">
          <Link color="foreground" className="hover:text-primary" href="/dashboard/chart">
            Performance Chart
          </Link>
          <Link color="foreground" className="hover:text-primary" href="/dashboard/insight">
          Insight Analytics
          </Link>
          <Link color="foreground" className="hover:text-primary" href="/dashboard/tradelog">
          Trade Log
          </Link>
        </div>
      </div>
      <main className="flex w-full pl-80">{children}</main>
    </div>
  );
}
