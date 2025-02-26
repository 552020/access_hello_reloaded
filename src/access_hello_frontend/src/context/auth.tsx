import { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { access_hello_backend } from "../../../declarations/access_hello_backend";
import { login, logout } from "@/api/auth";
import { autoAssignUserRole } from "@/api/roles";
// Constants from demo
const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    initializeAuthClient();
  }, []);

  const initializeAuthClient = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    if (await client.isAuthenticated()) {
      await updateIdentity(client);
    }
  };

  const updateIdentity = async (client: AuthClient) => {
    const newIdentity = client.getIdentity();
    console.log("[Auth Context] Updating Identity - Principal:", newIdentity.getPrincipal().toString());
    setIdentity(newIdentity);
    setIsAuthenticated(await client.isAuthenticated());

    const agent = Actor.agentOf(access_hello_backend);
    if (agent) {
      agent.replaceIdentity(newIdentity);
    }
  };

  const handleLogin = async () => {
    if (!authClient) return;
    console.log("[Auth Context] Starting login process");
    await login(authClient);
    await updateIdentity(authClient);
    console.log("[Auth Context] Assigning user role");
    await autoAssignUserRole();
    console.log("[Auth Context] Login completed");
  };

  const handleLogout = async () => {
    if (!authClient) return;
    await logout(authClient);
    await updateIdentity(authClient);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        identity,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
