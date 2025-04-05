import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";

export default function AdvisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <div className="fixed flex flex-col h-screen w-1/5 bg-foreground px-12 py-16 opacity-95 backdrop-blur-sm">
        <p className="font-semibold text-lg text-foreground uppercase">
          <Link color="primary" className="hover:text-background" href="/advisor/">
            Expert Advisors
          </Link>
        </p>
        <Divider className="my-4 bg-background" />
        <div className="flex flex-col w-full gap-2">
          <Link className="text-background hover:text-primary" href="/advisor">
          Deployed Advisors
          </Link>
          <Link className="text-background hover:text-primary" href="/advisor/create">
          Advisors Creation
          </Link>
          <Link className="text-background hover:text-primary" href="/advisor/trade_account">
            Trading Account
          </Link>
        </div>
      </div>
      <main className="flex w-full pl-80 min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
