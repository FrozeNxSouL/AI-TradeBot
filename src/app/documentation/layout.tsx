import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <div className="fixed flex flex-col h-screen w-1/5 bg-foreground px-12 py-16 opacity-95">
        <p className="font-semibold text-lg text-foreground uppercase">
          <Link color="primary" className="hover:text-background" href="/documentation/">
            Documentation
          </Link>
        </p>
        <Divider className="my-4 bg-background" />
        <div className="flex flex-col w-full gap-2">
          <Link className="text-background hover:text-primary" href="/documentation/start">
          Getting Start
          </Link>
          <Link className="text-background hover:text-primary" href="/documentation/ea_system">
          Expert Advisor
          </Link>
          <Link className="text-background hover:text-primary" href="/documentation/provider">
            Trading Provider
          </Link>
          <Link className="text-background hover:text-primary" href="/documentation/website">
            {"Website (Spectator)"}
          </Link>
          <Link className="text-background hover:text-primary" href="/documentation/pricing">
            Pricing
          </Link>
        </div>
      </div>
      <main className="flex w-full pl-80">{children}</main>
    </div>
  );
}
