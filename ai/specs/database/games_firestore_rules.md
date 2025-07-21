# Firestore Security Rule: `games` Collection

**Requirement:**

- The `games` collection must be publicly readable by all clients.
- No client (web, mobile, etc.) can ever write, update, or delete documents in the `games` collection. Only server-side/admin code may do so.

## Firestore Rule

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Games: Publicly readable, never writable by clients
    match /games/{gameId} {
      allow read: if true;
      allow write, update, delete: if false;
    }
  }
}
```

---

**Note:**

- All modifications to the `games` collection must be performed via secure backend (e.g., Firebase Admin SDK) and never from client-side code.
- This rule should be included in your Firestore security rules configuration.
