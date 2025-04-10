import { Link } from "@heroui/link";

export default function Footer() {
    return (
        <footer className="bg-foreground/95 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Company Info Column */}
                    <div>
                        <div className="flex w-full text-xl font-bold uppercase mb-4">
                            <p className="text-primary">money</p>
                            <p className="text-accent">glitch</p>
                        </div>
                        <p className="text-white/70 text-sm">
                            Empowering traders with advanced analytics and insights.
                        </p>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-400">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/advisor"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Expert Advisor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/Billing"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Billing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-400">
                            Documentation
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/documentation/start"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Getting Start
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation/ea_system"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Expert Advisor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation/provider"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Trading Provider
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation/website"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Website
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation/pricing"
                                    className="text-white/70 hover:text-green-400 transition"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-400">
                            Contact
                        </h4>
                        <ul className="space-y-2">
                            <li className="text-white/70">
                                Email: s6504062630375@email.kmutnb.ac.th
                            </li>
                            {/* <li className="text-white/70">
                                Phone: +1 (555) 123-4567
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/50 text-sm">
                        © {new Date().getFullYear()} Money Glitch Trading System. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}