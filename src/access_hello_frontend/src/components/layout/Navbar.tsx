import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex gap-6">
          <Link to="/" className="text-sm font-medium">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/profile" className="text-sm font-medium">
                Profile
              </Link>
              <Link to="/admin" className="text-sm font-medium">
                Admin
              </Link>
            </>
          )}
          <Link to="/demo" className="text-sm font-medium">
            II Demo
          </Link>
        </nav>
        <Button variant="outline">{isAuthenticated ? "Logout" : "Login"}</Button>
      </div>
    </header>
  );
}
