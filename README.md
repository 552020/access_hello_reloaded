# Access Hello Reloaded - WIP

## Overview

This sample project consists of a backend and a frontend.

The **backend** builds on the **access_hello** app from the section 3.6 of the Mokoto Liftoff https://internetcomputer.org/docs/current/tutorials/developer-liftoff/level-3/3.6-motoko-lvl3#principals-and-caller-identification. The demo application `access_hello` is not part of the [official examples](https://github.com/dfinity/examples) and its code is to find only in that lesson or in this other repo. It focus primarly on backend authentication/authorization.

Thr **frontend** builds on the sample app built in the guide [Integrating with II]https://internetcomputer.org/docs/current/developer-docs/identity/internet-identity/integrate-internet-identity. The original project has been refactored from [Lit](https://lit.dev/) into React/Vite.

The backend is tested and it works. The frontend is still work in progress.

## Principal Modifications of the Original access_hello Code

1. **Role System Changes**

   - Added new roles: #premium and #guest
   - Changed #authorized to #user for clarity

2. **Authorization System Simplification**

   - Replaced permission-based system with simpler role-based checks:
     - Removed Permission type entirely
     - Removed has_permission function
     - Added is_admin function as the main authorization check
   - Replaced require_permission with reject_if_not_admin

3. **Greeting Logic Updates**

   - Changed from if/else to switch statement
   - Added different greetings for each role
   - Made messages more specific to each role type

4. **Function Improvements**

   - assign_role now returns Text feedback instead of Unit
   - Added better error messages
   - Renamed functions for clarity:
     - callerPrincipal → get_caller_principal
     - my_role → get_caller_role
     - my_role_request → get_caller_role_request

## TODO

- [ ] Check if the user is anonymous

```motoko
   actor {
       public shared (msg) func whoami() : async Text {
           if (msg.caller == Principal.anonymous()) {
               return "You are not authenticated!";
           } else {
               return "Your Principal ID is: " # Principal.toText(msg.caller);
           };
       };
   };
```

## Example Usage of the backend

### Interacting with the dapp

In this tutorial, we'll create several users with different roles to test our access control system:

| User    | Role    | Description                                 |
| ------- | ------- | ------------------------------------------- |
| Lucy    | owner   | Has full control, can assign roles          |
| Mike    | admin   | Can manage other users and view all roles   |
| William | premium | Gets premium features and special greetings |
| Tracy   | user    | Basic user with game access                 |
| Bob     | guest   | Limited access with basic greeting          |

#### 1. Creating Our Users

First, let's create identities for all our users:

```bash
# Create Lucy (owner)
dfx identity new lucy
dfx identity use lucy

# Create Mike (future admin)
dfx identity new mike

# Create William (future premium user)
dfx identity new william

# Create Tracy (future regular user)
dfx identity new tracy

# Create Bob (future guest)
dfx identity new bob
```

#### 2. Deploy the Canister as Lucy (Owner)

Make sure you're using Lucy's identity before deploying:

```bash
dfx identity use lucy
dfx deploy
```

#### 3. Assigning Roles

Now let's set up everyone's roles. Lucy (as owner) will assign these:

```bash
# Make Mike an admin
dfx identity use mike
# Let's see Mike's initial greeting
dfx canister call access_hello_backend greet "Mike"
> ("Greetings, Mike! Nice to meet you.")
# Check Mike's current role (should be null or guest)
dfx canister call access_hello_backend get_caller_role
> (null)

# Get Mike's principal for Lucy to promote him
MIKE_PRINCIPAL=$(dfx identity get-principal)
echo $MIKE_PRINCIPAL
> jd3ip-dbxzn-lto6h-jrshc-kt6ev-6wmas-dwoch-owshm-tj7qf-vbxkx-jqe # This value is unique of course!

# Switch to Lucy to assign admin role
dfx identity use lucy
dfx canister call access_hello_backend assign_role "(principal \"$MIKE_PRINCIPAL\", opt variant { admin })"

# Switch back to Mike to verify his new powers
dfx identity use mike
# Check Mike's new role (should be admin)
dfx canister call access_hello_backend get_caller_role
# Try Mike's greeting again
dfx canister call access_hello_backend greet "Mike"
# Test Mike's admin powers by viewing all roles
dfx canister call access_hello_backend get_roles

# Give William premium access
dfx identity use william
WILLIAM_PRINCIPAL=$(dfx identity get-principal)
dfx identity use lucy
dfx canister call access_hello_backend assign_role "(principal \"$WILLIAM_PRINCIPAL\", opt variant { premium })"
dfx identity use william
dfx canister call access_hello_backend get_caller_role
dfx canister call access_hello_backend greet "William"



# Make Tracy a regular user
dfx identity use tracy
TRACY_PRINCIPAL=$(dfx identity get-principal)
dfx identity use lucy
dfx canister call access_hello_backend assign_role "(principal \"$TRACY_PRINCIPAL\", opt variant { user })"
dfx identity use tracy
dfx canister call access_hello_backend get_caller_role
dfx canister call access_hello_backend greet "Tracy"

# Set Bob as a guest
dfx identity use bob
BOB_PRINCIPAL=$(dfx identity get-principal)
dfx identity use lucy
dfx canister call access_hello_backend assign_role "(principal \"$BOB_PRINCIPAL\", opt variant { guest })"
dfx identity use bob
dfx canister call access_hello_backend get_caller_role
dfx canister call access_hello_backend greet "Bob"
```

#### 4. Testing Everyone's Access

Let's see how each user's greeting differs based on their role:

```bash
# Lucy (owner) tries to greet
dfx identity use lucy
dfx canister call access_hello_backend greet "Lucy"

# Mike (admin) tries to greet
dfx identity use mike
dfx canister call access_hello_backend greet "Mike"

# William (premium) tries to greet
dfx identity use william
dfx canister call access_hello_backend greet "William"

# Tracy (user) tries to greet
dfx identity use tracy
dfx canister call access_hello_backend greet "Tracy"

# Bob (guest) tries to greet
dfx identity use bob
dfx canister call access_hello_backend greet "Bob"
```

Expected greetings:

- Lucy & Mike: "Hello, [name]. You have administrative privileges."
- William: "Welcome, [name]! You have premium access. Ready to play?"
- Tracy: "Welcome, [name]! Would you like to play a game?"
- Bob: "Greetings, [name]! Nice to meet you."

#### 5. Viewing All Roles (Admin Functions)

Either Lucy or Mike can check the current roles and requests:

```bash
# Using Lucy (owner)
dfx identity use lucy
dfx canister call access_hello_backend get_roles
dfx canister call access_hello_backend get_role_requests
```

## Default `access_hello` README created by `dfx new`

Welcome to your new `access_hello` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `access_hello`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd access_hello/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor

## Installation

[Instructions for setting up the project]

## Usage

[Instructions for using the project]

## Contributing

[Guidelines for contributing to the project]

## License

[License information]
