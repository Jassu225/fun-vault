# LONG-TERM MEMORY

## MEMORY MANAGEMENT INSTRUCTIONS

`## MEMORY ENTRIES` section serves as the persistent memory store for development sessions.

### WHAT TO REMEMBER:

- Project context and architecture decisions
- User preferences and coding patterns
- Repeated bug fixes and their solutions
- Library/framework choices and rationale
- Development environment setup details

UPDATE PROCESS:

1. When learning something new about the project, add it to this file immediately
2. Use clear and short descriptions
3. Update existing entries rather than duplicating information
4. Ask user before adding personal/sensitive information

## MEMORY ENTRIES:

- This project uses Next.js 15 as framework, tailwind 4 for css, eslint and prettier for linting and formatting, react-testing-library for unit tests, Playwright for end-to-end tests, firebase-admin sdk on server-side for firestore connection, firebase sdk while testing.
- Firestore is never connected from the client; all Firestore operations are performed from the server side.
- The user requires that all operations and steps in the workflow must be logged. CHANGELOG format must be consistently followed when updating the project's CHANGELOG. CHANGELOG entries must be single-line, follow the existing pattern [YYYY-MM-DDTHH:MM:SSZ] - Description. [user's git email] (Tasks: #id). Include task references only if already established, and not invent new formats. Entries must be added in a reverse chronological order. CHANGELOG timestamp must be the current time and shouldn't be rounded.
- The user prefers organized spec structure with features grouped by domain (e.g., database features in ai/specs/features/database/). This applies to all specification documents and feature organization.
- Plan review process: User requires plan review and approval before execution. All references must be updated to reflect current file structure.
- Always use absolute imports instead of relative imports in their code. Use absolute imports even for same directory imports.
