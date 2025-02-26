import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { getCurrentRole, getPendingRequest, requestRole, revokeRoleRequest } from "@/api/roles";
import { Role } from "../../../../declarations/access_hello_backend/access_hello_backend.did";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Profile() {
  const { identity } = useAuth();
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "premium" | "guest" | "admin">("user");

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("[Profile] Starting to fetch user data");
      console.log("[Profile] Current Identity Principal:", identity?.getPrincipal().toString());

      const [role, request] = await Promise.all([getCurrentRole(), getPendingRequest()]);

      console.log("[Profile] Fetched Role:", role);
      console.log("[Profile] Fetched Request:", request);

      setCurrentRole(role);
      setPendingRequest(request.length > 0);
    };

    fetchUserData();
  }, [identity]);

  const roleMapping: Record<string, Role> = {
    user: { user: null },
    premium: { premium: null },
    guest: { guest: null },
    admin: { admin: null },
  };

  const handleRequestRole = async () => {
    try {
      const roleObject = roleMapping[selectedRole];
      await requestRole(roleObject);
      setPendingRequest(true);
    } catch (error) {
      console.error("Error requesting role:", error);
    }
  };

  const handleRevokeRequest = async () => {
    try {
      await revokeRoleRequest();
      setPendingRequest(false);
    } catch (error) {
      console.error("Error revoking request:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Your Principal ID:</h3>
          <p className="text-sm text-muted-foreground break-all">{identity?.getPrincipal().toString()}</p>
        </div>

        <div>
          <h3 className="font-medium">Current Role:</h3>
          <p className="text-sm text-muted-foreground">
            {currentRole ? Object.keys(currentRole)[0] : "No role assigned"}
          </p>
        </div>

        {!currentRole && !pendingRequest && (
          <div className="space-y-4">
            <Select
              onValueChange={(value: "user" | "premium" | "guest" | "admin") => setSelectedRole(value)}
              defaultValue="user"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRequestRole}>Request {selectedRole} Role</Button>
          </div>
        )}

        {pendingRequest && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Your role request is pending approval</p>
            <Button variant="outline" size="sm" onClick={handleRevokeRequest}>
              Cancel Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
