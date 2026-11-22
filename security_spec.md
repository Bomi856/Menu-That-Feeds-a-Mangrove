# Security Specification: Menu That Feeds a Mangrove

## 1. Data Invariants
- Every `/users/{userId}` document is strictly owned by `request.auth.uid == userId` with `request.auth.token.email_verified == true`.
- `uid` inside the document must match `request.auth.uid` on create and remain immutable on update.
- `createdAt` must equal `request.time` on create and remain immutable on update; `updatedAt` must equal `request.time` on both create and update.
- No collection-level `list` queries are permitted on `/users`.
- All strings, arrays (`unlockedWardrobe`, `equippedWardrobe`), and maps (`cookedCounts`, `readStories`, `solvedQuizzes`, `explorer`) have explicit key/size/type bounds.

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated read or write to `/users/userA`.
2. Unverified email user (`email_verified == false`) writing to `/users/userA`.
3. Cross-user read: `userB` reading `/users/userA`.
4. Cross-user write: `userB` writing `/users/userA`.
5. Identity spoofing: `userA` creating `/users/userA` with `{ uid: "userB" }`.
6. Ghost/shadow field injection: `{ ..., isAdmin: true }`.
7. Oversized ID poisoning: document ID > 128 chars or containing invalid symbols.
8. Oversized array poisoning: `unlockedWardrobe` with 50 items (> 10).
9. Wrong array element type: `equippedWardrobe: [123]`.
10. Client-forged timestamps: `createdAt` or `updatedAt` != `request.time`.
11. Mutating immutable fields on update: changing `uid` or `createdAt`.
12. Collection scraping: `list` query on `/users`.
