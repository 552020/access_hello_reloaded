import { access_hello_backend } from "../../../declarations/access_hello_backend";
import { Role } from "../../../declarations/access_hello_backend/access_hello_backend.did";
import { AuthClient } from "@dfinity/auth-client";
import { login } from "./auth";

export const getCurrentRole = async (): Promise<Role | null> => {
  console.log("[Roles API] Calling getCurrentRole");
  const result = await access_hello_backend.get_caller_role();
  console.log("[Roles API] getCurrentRole result:", result);

  // Handle all possible cases
  if (!result) return null; // If undefined
  if (result.length === 0) return null; // If empty array
  return result[0]; // Return first role if exists
};

export const getPendingRequest = async () => {
  return await access_hello_backend.get_caller_role_request();
};

export const requestRole = async (role: Role) => {
  return await access_hello_backend.request_role(role);
};

export const whoAmI = async () => {
  return await access_hello_backend.whoami();
};

export const greet = async (name: string) => {
  return await access_hello_backend.greet_alt(name);
};

export const autoAssignUserRole = async () => {
  console.log("[Roles API] Calling autoAssignUserRole");
  const result = await access_hello_backend.auto_assign_user_role();
  console.log("[Roles API] autoAssignUserRole result:", result);
  return result;
};

// New function that combines login and role assignment
export const autoAssignUserRoleAtLogin = async (authClient: AuthClient) => {
  await login(authClient);
  await autoAssignUserRole();
};

export const revokeRoleRequest = async () => {
  return await access_hello_backend.revoke_role_request();
};
