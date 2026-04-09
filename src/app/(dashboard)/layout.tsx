import Header from "@/components/user/user-header";
import Sidebar from "@/components/user/user-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex w-full flex-1 flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-350 flex-1 flex-row px-4 pb-12 lg:px-6 lg:pt-12">
                <Sidebar />
                <main className="w-full min-w-0 flex-1 lg:pl-16">
                    <div className="pt-6 lg:pt-0">{children}</div>
                </main>
            </div>
        </div>
    );
}
