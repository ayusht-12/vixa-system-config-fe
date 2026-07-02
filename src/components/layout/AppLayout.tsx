import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";

export function AppLayout() {
  return (
    <div className="min-h-full bg-backdrop grid-bg">
      <TopNav />
      <Outlet />
    </div>
  );
}
