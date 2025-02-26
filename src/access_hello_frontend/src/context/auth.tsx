import { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { access_hello_backend } from "../../../declarations/access_hello_backend";

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
    setIdentity(newIdentity);
    setIsAuthenticated(await client.isAuthenticated());

    const agent = Actor.agentOf(access_hello_backend);
    if (agent) {
      agent.replaceIdentity(newIdentity);
    }
  };

  const login = async () => {
    if (!authClient) return;

    await new Promise<void>((resolve, reject) =>
      authClient.login({
        identityProvider: identityProvider(),
        onSuccess: async () => {
          setIsAuthenticated(true);
          resolve();
        },
        onError: reject,
      })
    );

    await updateIdentity(authClient);
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    await updateIdentity(authClient);
  };

  return <AuthContext.Provider value={{ isAuthenticated, identity, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function for II URL
function identityProvider() {
  if (process.env.DFX_NETWORK === "local") {
    return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
  } else if (process.env.DFX_NETWORK === "ic") {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
  } else {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
  }
}
