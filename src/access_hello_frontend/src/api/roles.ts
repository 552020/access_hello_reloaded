import { access_hello_backend } from "../../../declarations/access_hello_backend";
import { Role } from "../../../declarations/access_hello_backend/access_hello_backend.did";

export const getCurrentRole = async (): Promise<Role[]> => {
  const roles = await access_hello_backend.get_caller_role();
  return roles || []; // Return an empty array if roles is undefined
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
