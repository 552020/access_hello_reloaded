import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { access_hello_backend } from "../../declarations/access_hello_backend";

// Define authentication options
const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai#authorize`,
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
      const client = await AuthClient.create(defaultOptions.createOptions);
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
        ...defaultOptions.loginOptions,
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
    const response = await access_hello_backend.greet(name);
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
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <main className="space-y-6">
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
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Click Me!
            </button>
          </form>

          <section id="greeting" className="text-center text-lg text-gray-800">
            {greeting}
          </section>

          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            )}
            <button
              onClick={handleWhoAmI}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Who am I?
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
