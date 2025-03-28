import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

shared({ caller = initializer }) actor class() {

	// This is the greet function from the auth-ii example.
	public shared(msg) func greet_alt(name : Text) : async Text {
        return "Hello, " # name # "! Your principal is: " # Principal.toText(msg.caller);
    };

	// Original auth-ii whoami function
    public shared query (msg) func whoami() : async Principal {
        msg.caller
    };
	
	// This is the greet function from the access-hello project. 
	public shared({ caller }) func greet(name : Text) : async Text {
		switch (get_role(caller)) {
			case (?#owner or ?#admin) {
				return "Hello, " # name # ". You have administrative privileges.";
			};
			case (?#premium) {
				return "Welcome, " # name # "! You have premium access. Ready to play?";
			};
			case (?#user) {
				return "Welcome, " # name # "! You are just another normal user?";
			};
			case (?#guest or null) {
				return "Greetings, " # name # "! Nice to meet you.";
			};
		};
	};

	public type Role = {
		#owner;
		#admin;
		#premium;
		#user;
		#guest;
	};

	private stable var roles: AssocList.AssocList<Principal, Role> = List.nil();
	private stable var role_requests: AssocList.AssocList<Principal, Role> = List.nil();

	func principal_eq(a: Principal, b: Principal): Bool {
		return a == b;
	};

	// If the Principal isn't the initializer AND isn't found in the roles AssocList, then get_role returns null (because AssocList.find returns null when no match is found)
	func get_role(pal: Principal) : ?Role {
		if (pal == initializer) {
			?#owner;
		} else {
			AssocList.find<Principal, Role>(roles, pal, principal_eq);
		};
	};

	func is_admin(pal: Principal) : Bool {
		switch (get_role(pal)) {
			case (?#owner or ?#admin) { true };
			case (_) { false };
		};
	};

	// Error handling will be considered in the next unit
	func reject_if_not_admin(pal: Principal) : async () {
		if (not is_admin(pal)) {
			throw Error.reject("unauthorized: admin privileges required");
		};
	};

	public shared({ caller }) func assign_role(assignee: Principal, new_role: ?Role) : async Text {
		// await require_permission(caller, #assign_role);
		await reject_if_not_admin(caller);

		switch new_role {
			case (?#owner) {
				throw Error.reject("unauthorized: cannot assign owner role");
			};
			case (_) {};
		};
		if (assignee == initializer) {
			throw Error.reject("unauthorized: cannot modify canister owner's role");
		};
		roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
		role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;

		 switch new_role {
            case (?role) {
                return "Successfully assigned role: " # debug_show(role);
            };
            case null {
                return "Successfully removed all roles";
            };
        };
	};

	// If a user already has a pending request, replace will update it. If they don't have a
	// request, replace will add a new one. There's no simple "push" because it's not a regular list: it's a list of unique key-value pairs
	public shared({ caller }) func request_role(role: Role) : async Principal {
		role_requests := AssocList.replace<Principal, Role>(role_requests, caller, principal_eq, ?role).0;
		return caller;
	};

	public shared({ caller }) func get_caller_principal() : async Principal {
		return caller;
	};

	public shared({ caller }) func get_caller_role() : async ?Role {
		Debug.print("get_caller_role called by: " # Principal.toText(caller));
		Debug.print("Current roles: " # debug_show(roles));
		
		let result = get_role(caller);
		Debug.print("Result: " # debug_show(result));
		return result;
	};

	public shared({ caller }) func get_caller_role_request() : async ?Role {
		AssocList.find<Principal, Role>(role_requests, caller, principal_eq);
	};

	public shared({ caller }) func get_role_requests() : async List.List<(Principal,Role)> {
		await reject_if_not_admin(caller);
		return role_requests;
	};

	public shared({ caller }) func get_roles() : async List.List<(Principal,Role)> {
		await reject_if_not_admin(caller);
		return roles;
	};
	// We want to auto-assign the user role to all new users who logged int
	public shared({ caller }) func auto_assign_user_role() : async Text {
		let callerText = Principal.toText(caller);
		Debug.print("auto_assign_user_role called by: " # callerText);
		Debug.print("Current roles before assignment: " # debug_show(roles));
		
		switch (get_role(caller)) {
			case (null) {
				roles := AssocList.replace<Principal, Role>(roles, caller, principal_eq, ?#user).0;
				Debug.print("After assignment - roles: " # debug_show(roles));
				"Successfully assigned user role"
			};
			case (_) {
				Debug.print("User already has role");
				"User already has a role"
			};
		};
	};

	public shared({ caller }) func revoke_role_request() : async Text {
		let callerText = Principal.toText(caller);
		Debug.print("revoke_role_request called by: " # callerText);
		Debug.print("Current roles: " # debug_show(roles));
		Debug.print("Current role requests: " # debug_show(role_requests));
		
		switch (AssocList.find<Principal, Role>(role_requests, caller, principal_eq)) {
			case (null) {
				Debug.print("No pending request found for caller");
				"No pending request found";
			};
			case (?role) {
				Debug.print("Found pending request: " # debug_show(role));
				role_requests := AssocList.replace<Principal, Role>(role_requests, caller, principal_eq, null).0;
				Debug.print("After revocation - role requests: " # debug_show(role_requests));
				"Request revoked successfully";
			};
		};
	};

	public shared({ caller }) func reject_role_request(assignee: Principal) : async Text {
		await reject_if_not_admin(caller);
		
		switch (AssocList.find<Principal, Role>(role_requests, assignee, principal_eq)) {
			case (null) {
				return "No pending request found for this principal";
			};
			case (_) {
				role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
				return "Request rejected successfully";
			};
		};
	};

	public shared({ caller }) func accept_role_request(assignee: Principal) : async Text {
		await reject_if_not_admin(caller);
		
		switch (AssocList.find<Principal, Role>(role_requests, assignee, principal_eq)) {
			case (null) {
				return "No pending request found for this principal";
			};
			case (?requested_role) {
				roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, ?requested_role).0;
				role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
				return "Request accepted successfully: " # debug_show(requested_role);
			};
		};
	};
}