import { AuthClient } from "@dfinity/auth-client";
import { autoAssignUserRole } from "./roles";

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
  await new Promise<void>((resolve, reject) =>
    authClient.login({
      identityProvider: identityProvider(),
      onSuccess: async () => {
        await autoAssignUserRole();
        resolve();
      },
      onError: reject,
    })
  );
};

export const logout = async (authClient: AuthClient) => {
  await authClient.logout();
};
