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
    <div className="container">
      <main>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <button type="submit">Click Me!</button>
        </form>
        <section id="greeting">{greeting}</section>
        <center>
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
          <button onClick={handleWhoAmI}>Who am I?</button>
        </center>
      </main>
    </div>
  );
};

export default App;
