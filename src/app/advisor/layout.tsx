import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function AdvisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <div className="fixed flex flex-col h-screen w-1/5 bg-background px-12 py-16 opacity-95">
        <p className="font-semibold text-lg text-foreground uppercase">
          <Link color="primary" className="hover:text-foreground" href="/advisor/">
            Expert Advisors
          </Link>
        </p>
        <Divider className="my-4 bg-foreground" />
        <div className="flex flex-col w-full gap-2">
          <Link color="foreground" className="hover:text-primary" href="/advisor">
          Deployed Advisors
          </Link>
          <Link color="foreground" className="hover:text-primary" href="/advisor/create">
          Advisors Creation
          </Link>
          <Link color="foreground" className="hover:text-primary" href="/advisor/trade_account">
            Trading Account
          </Link>
        </div>
      </div>
      <main className="flex w-full pl-80">{children}</main>
    </div>
  );
}
