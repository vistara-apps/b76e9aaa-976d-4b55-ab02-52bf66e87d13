# Civic Ballot - Base Mini App

A secure, real-time platform for community voting and polling built as a Base Mini App using MiniKit and OnchainKit.

## Features

- **Voter Registration & Management**: Import and manage eligible voters with status tracking
- **Real-time Poll Creation**: Create polls with multiple options and real-time results
- **Secure Voting**: Anonymous voting with duplicate prevention using Farcaster identity
- **Results Visualization**: Interactive charts and detailed breakdowns
- **Base Integration**: Built on Base blockchain for transparency and security

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via MiniKit)
- **Identity**: Farcaster (via OnchainKit)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_MINIKIT_API_KEY=your_minikit_api_key_here
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Poll
1. Navigate to "Create Poll" in the sidebar
2. Enter poll title and description
3. Add 2-6 voting options
4. Click "Create Poll" to make it live

### Managing Voters
1. Go to "Record Voters" section
2. Add voters by Farcaster ID or wallet address
3. Track voter status (registered, contacted, voted)
4. Import voter lists for larger polls

### Voting
1. Select "Vote Exercise" when a poll is active
2. Choose your preferred option
3. Submit your vote securely
4. View real-time results after voting

### Viewing Results
1. Access "View Results" to see poll outcomes
2. Switch between bar chart and pie chart views
3. Export results or share with community
4. View detailed breakdowns and statistics

## Architecture

- **app/**: Next.js App Router pages and layouts
- **components/**: Reusable UI components
- **lib/**: Utilities, types, and helper functions
- **public/**: Static assets

## Key Components

- **FrameHeader**: App header with identity and wallet connection
- **Navigation**: Sidebar navigation with poll status
- **VoterManagement**: Voter registration and status tracking
- **PollCreation**: Poll creation interface with preview
- **VotingInterface**: Secure voting with real-time feedback
- **ResultsDisplay**: Interactive results visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
