# **`initializer` vs `owner` in Motoko** in this example and the precedent one

For the precedent example referred here check: https://internetcomputer.org/docs/current/tutorials/developer-liftoff/level-3/3.6-motoko-lvl3#principals-and-caller-identification

## **Overview**

In Motoko, capturing the deployer's identity (`Principal`) is crucial for access control. There are two common ways to extract the deployer’s principal in an actor class:

1. Using **`shared(msg) actor class {}`** with `msg.caller`
2. Using **`shared({ caller = initializer }) actor class {}`** with pattern matching

Additionally, in this example, `owner` is not just a variable storing a Principal but a **variant of a type**, as seen in `access_hello`.

---

## **1️⃣ Extracting the Deployer's Principal**

Both methods capture the identity of the canister's deployer but use different syntax.

### **Method 1: Using `msg.caller`**

Example from the documentation:

```motoko
shared(msg) actor class Counter(init : Nat) {
  let owner = msg.caller; // Captures the caller at instantiation time

  var count = init;

  public shared(msg) func inc() : async () {
    assert (owner == msg.caller); // Only the deployer can increment
    count += 1;
  };

  public shared(msg) func bump() : async Nat {
    assert (owner == msg.caller); // Only the deployer can reset the count
    count := 1;
    count;
  };
}
```

### ✅ **How it works**

- `msg.caller` is extracted inside the **constructor** and stored in `owner`.
- This ensures that the **deployer (installer)** has privileged access.
- The deployer remains the only entity able to increment or reset `count`.

---

### **Method 2: Using Pattern Matching (`initializer`)**

Modern Motoko prefers pattern matching at the actor class level:

```motoko
shared({ caller = initializer }) actor class Counter(init : Nat) {
  let owner = initializer; // Captures the caller at instantiation time
}
```

### ✅ **How it works**

- `caller` is extracted **directly** at the actor class level using pattern matching.
- This is **more concise** and achieves the same effect as `msg.caller`.

---

## **2️⃣ `owner` in `access_hello` Has a Different Meaning**

In `access_hello`, `owner` is **not a variable storing a Principal**, but instead a **variant of a type**:

```motoko
public type Role = {
  #owner;
  #admin;
  #authorized;
};
```

### ✅ **How is this different?**

- This `owner` is part of a **custom-defined type** (`Role`), not a stored `Principal`.
- The meaning of `#owner` in this context is **not** about tracking the deployer but **defining a role** in an access control system.

---

## **3️⃣ Summary Table**

| **Term**      | **Meaning in Counter Example**               | **Meaning in access_hello**                     |
| ------------- | -------------------------------------------- | ----------------------------------------------- |
| `owner`       | Captures the **Principal** of the deployer   | A **variant** of `Role`                         |
| `initializer` | Captures the deployer using pattern matching | **Not used** in `access_hello`                  |
| `msg.caller`  | Captures the deployer inside the constructor | Captures caller identity for each function call |

---

## **4️⃣ Which One Should You Use?**

| **Scenario**                                    | **Best Approach**                                   |
| ----------------------------------------------- | --------------------------------------------------- |
| Capturing the deployer's Principal securely     | `shared({ caller = initializer })`                  |
| Assigning roles with a type system              | Use variants like `#owner`, `#admin`, `#authorized` |
| Traditional approach with explicit `msg.caller` | `shared(msg) actor class {}`                        |

For modern Motoko, **pattern matching (`initializer`) is recommended** for capturing the deployer, while `#owner` as a variant is best for defining role-based access.

Would you like further examples or modifications? 🚀
