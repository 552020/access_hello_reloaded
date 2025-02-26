import { access_hello_backend } from "../../../declarations/access_hello_backend";

export const greet = async (name: string) => {
  return await access_hello_backend.greet(name);
};

export const greetAlt = async (name: string) => {
  return await access_hello_backend.greet_alt(name);
};
