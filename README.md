# Fun-Vault

A cyberpunk-themed digital arcade for classic strategy games.

## Features

- 🎮 Classic strategy games (Tic-Tac-Toe, Connect 4, Checkers)
- 🤖 AI opponents powered by Hugging Face
- 🎨 Cyberpunk-themed UI with Tailwind CSS
- 📊 Anonymous statistics tracking with Firebase Auth
- 🔥 Real-time gameplay with Firestore
- 🔐 Secure anonymous authentication

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Anonymous Auth
- **AI**: Hugging Face Inference API
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for production)
- Hugging Face API key (for AI opponents)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fun-vault
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables (see Environment Variables section below)

5. Start the development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required for Development

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
ENVIRONMENT=development

# For testing with emulator
FIRESTORE_EMULATOR_HOST=localhost:8080
```

### Required for Production

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT=base64-encoded-service-account-json
ENVIRONMENT=production

# Hugging Face API (for AI opponents)
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### Optional

```bash
# For testing
ENVIRONMENT=test
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Enable Authentication and configure Anonymous sign-in
5. Set up security rules (see Security Rules section)

### 2. Service Account Setup (Production)

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Encode it as base64:

```bash
base64 -i path/to/service-account.json
```

5. Add the base64 string to your `FIREBASE_SERVICE_ACCOUNT` environment variable

### 3. Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Anonymous authentication
3. Configure any additional sign-in methods if needed

### 4. Firestore Emulator (Development/Testing)

For local development and testing, use the Firestore emulator:

1. Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

2. Start the emulator:

```bash
npm run emulators
```

This will start the Firestore emulator on `localhost:8080`.

## Database Schema

### Collections

#### `games`

Stores game metadata and configuration.

```typescript
interface Game {
  uid: string; // auto-generated
  gameId: string; // 'tic-tac-toe', 'connect4', etc.
  name: string;
  description: string;
  category: GameCategory;
  icon: string; // emoji
  isActive: boolean;
  createdAt: string; // ISO 8601 UTC
  lastUpdatedAt: string; // ISO 8601 UTC
}
```

#### `gameSessions`

Tracks individual game sessions.

```typescript
interface GameSession {
  uid: string; // auto-generated
  gameUid: string; // reference to games collection
  anonymousUserUid: string; // Firebase Auth UID from anonymous sign-in
  status: GameSessionStatus;
  winner: PlayerType;
  startedAt: string; // ISO 8601 UTC
  endedAt: string; // ISO 8601 UTC
  createdAt: string; // ISO 8601 UTC
  lastUpdatedAt: string; // ISO 8601 UTC
}
```

#### `anonymousUsers`

Tracks anonymous user statistics using Firebase Auth UIDs.

```typescript
interface AnonymousUser {
  uid: string; // Firebase Auth UID from anonymous sign-in
  gamesPlayed: number;
  lastActiveAt: string; // ISO 8601 UTC
  createdAt: string; // ISO 8601 UTC
}
```

#### `gameStatistics`

Per-game statistics and analytics.

```typescript
interface GameStats {
  uid: string; // auto-generated
  gameUid: string; // reference to games collection
  totalGamesPlayed: number;
  averagePlayTime: number; // minutes
  winRate: {
    player: number;
    ai: number;
    draw: number;
  };
  lastUpdatedAt: string; // ISO 8601 UTC
}
```

#### `globalStatistics`

Global platform statistics.

```typescript
interface GlobalStats {
  totalGamesPlayed: number;
  totalPlayers: number;
  totalMatches: number;
  lastUpdatedAt: string; // ISO 8601 UTC
}
```

## Security Rules

The Firestore security rules are configured in `firestore.rules`:

- **Games**: Read-only for all users, write-only by admin
- **Game Sessions**: Read/write for authenticated users (no deletion)
- **Anonymous Users**: Read/write for authenticated users (no deletion)
- **Game Statistics**: Read-only for all users, write-only by admin
- **Global Statistics**: Read-only for all users, write-only by admin

## Authentication

The application uses Firebase Anonymous Authentication:

- **Automatic sign-in**: Users are automatically signed in anonymously
- **Persistent sessions**: Sessions persist across browser sessions
- **Secure UIDs**: Each user gets a unique Firebase Auth UID
- **Seamless experience**: No user interaction required for authentication

## Testing

### Unit Tests

```bash
npm run test:unit
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Database Tests

```bash
npm run test:unit -- --testPathPatterns=database.test.ts
```

## Development

### Database Operations

The project uses a comprehensive database service (`src/services/database.ts`) that provides:

- **CRUD operations** for all collections
- **Type-safe** operations with TypeScript
- **Automatic timestamp** management
- **Error handling** and validation

Example usage:

```typescript
import { createGame, getGame, createGameSession } from '@/services/database';

// Create a game
const gameRef = await createGame({
  gameId: 'tic-tac-toe',
  name: 'Tic-Tac-Toe',
  description: 'Classic 3x3 strategy game',
  category: GameCategory.STRATEGY,
  icon: '⭕',
  isActive: true,
});

// Create a game session
const sessionRef = await createGameSession({
  gameUid: gameRef.id,
  anonymousUserUid: 'firebase-auth-uid',
  status: GameSessionStatus.STARTED,
  winner: PlayerType.PLAYER,
  startedAt: new Date().toISOString(),
  endedAt: null,
});
```

### Firebase Admin SDK

The project uses Firebase Admin SDK for server-side operations:

- **Environment-based configuration** (emulator vs production)
- **Service account authentication** for production
- **Emulator support** for development and testing
- **Automatic initialization** and error handling

### Firebase Auth Integration

The client-side uses Firebase Auth for anonymous authentication:

- **Automatic anonymous sign-in** on app load
- **Persistent user sessions** across browser sessions
- **Secure UID generation** for user identification
- **Seamless user experience** with no manual authentication required

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (base64 encoded)
- `ENVIRONMENT=production`
- `HUGGINGFACE_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

ISC
