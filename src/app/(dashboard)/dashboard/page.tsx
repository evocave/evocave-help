import UserDashboardPage from "@/components/user/dashboard/user-dashboard-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default function DashboardPage() {
    return <UserDashboardPage />;
}
