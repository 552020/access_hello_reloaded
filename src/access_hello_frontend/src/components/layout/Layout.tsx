import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  isAuthenticated: boolean;
}

export default function Layout({ isAuthenticated }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
