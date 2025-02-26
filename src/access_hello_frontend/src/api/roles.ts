import { access_hello_backend } from "../../../declarations/access_hello_backend";

export const getCurrentRole = async () => {
  return await access_hello_backend.get_caller_role();
};

export const getPendingRequest = async () => {
  return await access_hello_backend.get_caller_role_request();
};

export const requestRole = async (role: string) => {
  return await access_hello_backend.request_role(role);
};

export const whoAmI = async () => {
  return await access_hello_backend.whoami();
};

export const greet = async (name: string) => {
  return await access_hello_backend.greet_alt(name);
};
