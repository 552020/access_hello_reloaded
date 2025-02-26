import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { access_hello_backend } from "../../../../declarations/access_hello_backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define authentication options
const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);

// Function to get the correct II URL
const identityProvider = () => {
  if (process.env.DFX_NETWORK === "local") {
    return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
  } else if (process.env.DFX_NETWORK === "ic") {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
  } else {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
  }
};

// Use the function in defaultOptions
const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: identityProvider(),
    maxTimeToLive: days * hours * nanoseconds,
  },
};

const App: React.FC = () => {
  // State management
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [greeting, setGreeting] = useState<string>("");

  // Initialize AuthClient and check session
  useEffect(() => {
    const initializeAuthClient = async () => {
      //   const client = await AuthClient.create(defaultOptions.createOptions);
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        await updateIdentity(client);
      }
    };
    initializeAuthClient();
  }, []);

  // Function to update backend identity
  //   async function updateIdentity(authClient: AuthClient) {
  //     const identity = authClient.getIdentity();
  //     let agent = Actor.agentOf(ii_backend);

  //     if (!agent) {
  //       agent = await HttpAgent.create({ identity });
  //       Actor.overrideAgent(ii_backend, agent);
  //     } else {
  //       agent.replaceIdentity(identity);
  //     }
  //   }

  async function updateIdentity(authClient: AuthClient) {
    const newIdentity = authClient.getIdentity();
    setIdentity(newIdentity); // Now using setIdentity
    setIsAuthenticated(await authClient.isAuthenticated()); // Now using setIsAuthenticated
    // const identity = authClient.getIdentity();
    const agent = Actor.agentOf(access_hello_backend);

    if (agent) {
      agent.replaceIdentity(newIdentity);
    }
  }

  // Login handler
  const handleLogin = async () => {
    if (!authClient) return;

    await new Promise<void>((resolve, reject) =>
      authClient.login({
        identityProvider: identityProvider(),
        onSuccess: resolve,
        onError: reject,
      })
    );

    await updateIdentity(authClient);
  };

  // Logout handler
  const handleLogout = async () => {
    if (!authClient) return;

    await authClient.logout();
    await updateIdentity(authClient);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements.namedItem("name") as HTMLInputElement;
    if (!inputElement) return;

    const name = inputElement.value;
    const response = await access_hello_backend.greet_alt(name);
    setGreeting(response);
  };

  // Fetch and display user's principal
  const handleWhoAmI = async () => {
    if (!access_hello_backend) return;
    const principal = await access_hello_backend.whoami();
    setGreeting(`Your principal is: ${principal}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Internet Identity Demo</CardTitle>
          <CardDescription>Authenticate and interact with your Internet Identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="name" className="text-gray-700">
                Enter your name:
              </label>
              <input
                id="name"
                alt="Name"
                type="text"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full">
              Click Me!
            </Button>
          </form>

          {greeting && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-center text-lg text-gray-800">{greeting}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} variant="default">
                Login
              </Button>
            )}
            <Button onClick={handleWhoAmI} variant="secondary">
              Who am I?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
