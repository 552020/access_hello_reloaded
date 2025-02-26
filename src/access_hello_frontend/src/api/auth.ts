import { AuthClient } from "@dfinity/auth-client";

// Helper function for II URL
export function identityProvider() {
  if (process.env.DFX_NETWORK === "local") {
    return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
  } else if (process.env.DFX_NETWORK === "ic") {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
  } else {
    return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
  }
}

export const login = async (authClient: AuthClient) => {
  console.log("[Auth API] Starting login process");
  console.log("[Auth API] Current principal (before II):", authClient.getIdentity().getPrincipal().toString());

  await new Promise<void>((resolve, reject) =>
    authClient.login({
      identityProvider: identityProvider(),
      onSuccess: async () => {
        console.log("[Auth API] II Login successful");
        console.log("[Auth API] New principal (after II):", authClient.getIdentity().getPrincipal().toString());
        resolve();
      },
      onError: reject,
    })
  );
};

export const logout = async (authClient: AuthClient) => {
  await authClient.logout();
};
