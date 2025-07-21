# Fun-Vault

A cyberpunk-themed digital arcade for classic strategy games, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎮 Classic strategy games (Tic-Tac-Toe, Connect 4, Checkers, etc.)
- 🤖 AI opponents powered by Hugging Face inference
- 🎨 Cyberpunk aesthetic with neon styling
- 📊 Basic statistics tracking
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and React
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Database**: Firestore for data persistence
- **AI**: Hugging Face Inference API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then add your Firebase and Hugging Face configuration.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fun-vault/
├── src/
│   ├── app/           # Next.js 15 App Router
│   ├── components/    # Reusable UI components
│   ├── lib/          # Utilities and configurations
│   └── games/        # Individual game implementations
├── public/           # Static assets
├── ai/              # Project documentation and specs
└── .taskmaster/     # Task management
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC
