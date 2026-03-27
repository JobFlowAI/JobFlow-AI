import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-[260px] transition-all duration-300">
        <TopBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
