import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { access_hello_backend } from "../../../../declarations/access_hello_backend";
import { Principal } from "@dfinity/principal";

type RoleRequest = {
  principal: string;
  requestedRole: string;
};

export default function Admin() {
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const fetchRoleRequests = async () => {
    try {
      const requests = await access_hello_backend.get_role_requests();
      const formattedRequests = requests.map(([principal, role]) => ({
        principal: principal.toString(),
        requestedRole: Object.keys(role)[0],
      }));
      setRoleRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching role requests:", error);
    }
  };

  const handleAcceptRequest = async (principal: string) => {
    try {
      const principalObj = Principal.fromText(principal);
      await access_hello_backend.accept_role_request(principalObj);
      await fetchRoleRequests(); // Refresh the list
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (principal: string) => {
    try {
      const principalObj = Principal.fromText(principal);
      await access_hello_backend.reject_role_request(principalObj);
      await fetchRoleRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Role Requests</h2>
          {roleRequests.length === 0 ? (
            <p className="text-gray-500">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {roleRequests.map((request) => (
                <div key={request.principal} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Principal: {request.principal}</p>
                    <p className="text-sm text-gray-600">Requested Role: {request.requestedRole}</p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => handleAcceptRequest(request.principal)}>Approve</Button>
                    <Button variant="destructive" onClick={() => handleRejectRequest(request.principal)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
