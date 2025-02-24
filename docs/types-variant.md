# Variants

## Official

From the official docs --> https://github.com/Web3NL/motoko-book/blob/main/src/common-programming-concepts/types/variants.md

A variant is a type that can take on _one_ of a fixed set of values. We define it as a set of values, for example:

```motoko
type MyVariant = {
    #Black;
    #White;
};
```

The variant type above has two variants: `#Black` and `#White`. When we use this type, we have to choose one of the variants. Lets declare a variable of this type and assign the `#Black` variant value to it.

```motoko
let myVariant : MyVariant = #Black;
```

Variants can also have an associated type attached to them. Here's an example of variants associated with the `Nat` type.

```motoko
type Person = {
    #Male : Nat;
    #Female : Nat;
};

let me : Person = #Male 34;

let her : Person = #Female(29);
```

Note the two equivalent ways of using a variant value. The `#Male 34` defines the `Nat` value separated by the variant with a space. The `#Female(29)` uses `()` without a space. Both are the same.

Variants can have different types associated to them or no type at all. For example we could have an `OsConfig` variant type that in certain cases specifies an OS version.

```motoko
type OsConfig = {
    #Mac;
    #Windows : Nat;
    #Linux : Text;
};

let linux = #Linux "Ubuntu";
```

In the case of the `#Linux` variant, the associated type is a `Text` value to indicate the Linux Distribution. In case of `#Windows` we use a `Nat` to indicate the Windows Version. And in case of `#Mac` we don't specify any version at all.

Note that the last variable declaration is not type annotated. That's fine, because Motoko will infer the type that we declared earlier.

Here's a markdown file `variant-types.md` explaining Motoko's variant types, along with comparisons to C, C++, Rust, and JavaScript.

## AI **Understanding Variant Types in Motoko**

## **What is a Variant Type?**

A **variant type** in Motoko is a type that can take on **one of a fixed set of values**. Each value is represented by a **tag** (preceded by `#`), and optionally, it may carry an associated value.

### **Example in Motoko**

```motoko
public type Role = {
    #owner;
    #admin;
    #authorized;
};
```

This defines a type called `Role`, which can take **only one** of the three possible values:

- `#owner`
- `#admin`
- `#authorized`

A variable of type `Role` must hold **exactly one** of these variants:

```motoko
let userRole : Role = #admin;
```

This means `userRole` is currently **`#admin`**, and it cannot hold multiple values at once.

---

## **Variants with Associated Data**

Variants can also carry **associated values**, similar to enums with data in other languages.

### **Example: Storing a Person’s Age**

```motoko
type Person = {
    #Male : Nat;
    #Female : Nat;
};

let me : Person = #Male 34;      // Equivalent to #Male(34)
let her : Person = #Female(29);  // Uses parentheses, but both are valid
```

- `#Male 34` means `"Male, age 34"`
- `#Female(29)` means `"Female, age 29"`

Variants allow different types for different cases:

```motoko
type OsConfig = {
    #Mac;             // No associated value
    #Windows : Nat;   // Holds a version number
    #Linux : Text;    // Holds a distribution name
};

let linux = #Linux "Ubuntu";   // Represents "Linux - Ubuntu"
let windows = #Windows 11;     // Represents "Windows - version 11"
```

---

## **How Do Variants Compare to Other Languages?**

Motoko’s variants resemble **enums and sum types** found in other languages. Let's see how they compare.

### **1️⃣ C: `enum` (No Associated Data)**

C’s `enum` provides named integer constants but **does not** allow associated data.

```c
typedef enum {
    OWNER,
    ADMIN,
    AUTHORIZED
} Role;

Role userRole = ADMIN;
```

- 🚫 **Cannot attach values** to `enum` members.
- ✅ **Can be used as named constants** but are just integers.

To store associated data, you need a `struct`:

```c
typedef struct {
    int age;
    char* gender;
} Person;
```

### **2️⃣ C++: `enum class` (Scoped, But No Data)**

C++ introduced `enum class` to improve type safety, but it **still does not** allow associated data.

```cpp
enum class Role { Owner, Admin, Authorized };

Role userRole = Role::Admin;
```

- ✅ Scoped under `Role::`
- 🚫 No associated data.

To support data, you would need a `struct` or `std::variant`:

```cpp
#include <variant>
struct Person {
    std::variant<int, std::string> data;
};
Person p = {34}; // Represents age
```

### **3️⃣ Rust: `enum` (Similar to Motoko)**

Rust’s `enum` is **very similar** to Motoko’s variant types, allowing **both named cases and associated values**.

```rust
enum Role {
    Owner,
    Admin,
    Authorized,
}

let user_role: Role = Role::Admin;
```

With associated data:

```rust
enum Person {
    Male(u32),   // Stores an age (Nat equivalent)
    Female(u32), // Stores an age
}

let me = Person::Male(34);
let her = Person::Female(29);
```

✅ **Rust’s enums are very close to Motoko’s variant types.**

### **4️⃣ JavaScript: Objects (No Native Variants)**

JavaScript does not have a built-in **variant type**. The closest alternatives are:

#### **Using Objects**

```js
const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  AUTHORIZED: "authorized",
};

let userRole = Role.ADMIN;
```

🚫 **Cannot enforce only one of the possible values.**

#### **Using Tagged Unions (Like Variants)**

A manually implemented pattern:

```js
const userRole = { tag: "Admin" };
const person = { tag: "Male", value: 34 };
```

🚫 **No strict type safety** like Motoko, Rust, or C++.

---

## **Comparison Table**

| Feature          | **Motoko**             | **C (`enum`)**        | **C++ (`enum class`)** | **Rust (`enum`)**      | **JavaScript**   |
| ---------------- | ---------------------- | --------------------- | ---------------------- | ---------------------- | ---------------- |
| Named Cases      | ✅ Yes (`#owner`)      | ✅ Yes (`OWNER`)      | ✅ Yes (`Role::Owner`) | ✅ Yes (`Role::Owner`) | ✅ Yes (Objects) |
| Type-Safe        | ✅ Yes                 | 🚫 No (Integer-based) | ✅ Yes                 | ✅ Yes                 | 🚫 No            |
| Associated Data  | ✅ Yes (`#Male 34`)    | 🚫 No                 | 🚫 No                  | ✅ Yes (`Male(u32)`)   | 🚫 No            |
| Pattern Matching | ✅ Yes (`switch case`) | 🚫 No                 | 🚫 No                  | ✅ Yes (`match`)       | 🚫 No            |
| Runtime Safety   | ✅ Yes (Immutable)     | 🚫 No (Can cast ints) | ✅ Yes                 | ✅ Yes                 | 🚫 No            |

---

## **Conclusion**

- **Motoko’s variant types are closest to Rust’s `enum` types** in flexibility and safety.
- **C and C++ enums** do not support associated data natively.
- **JavaScript lacks variants**, so you must use objects or tagged unions manually.

Variants in Motoko **provide safety, immutability, and ease of use**, making them an excellent choice for defining **mutually exclusive states** like user roles or system configurations.

Would you like additional examples on how to use variants in pattern matching? 🚀
