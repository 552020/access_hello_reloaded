import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";

export default function Navbar() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex gap-1">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          {isAuthenticated && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" asChild>
            <Link to="/demo">II Demo</Link>
          </Button>
        </nav>
        <Button variant="outline" onClick={isAuthenticated ? logout : login}>
          {isAuthenticated ? "Logout" : "Login"}
        </Button>
      </div>
    </header>
  );
}
