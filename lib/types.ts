export interface Poll {
  pollId: string;
  organizerFid: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: Date;
  status: 'draft' | 'active' | 'closed';
  eligibleVoters?: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Voter {
  voterId: string;
  fid: string;
  walletAddress?: string;
  statusTags: VoterStatus[];
  displayName?: string;
}

export type VoterStatus = 'registered' | 'contacted' | 'voted' | 'eligible';

export interface Vote {
  voteId: string;
  pollId: string;
  voterFid: string;
  selectedOption: string;
  votedAt: Date;
}

export interface VotingStats {
  totalVotes: number;
  totalEligible: number;
  turnoutPercentage: number;
  optionResults: {
    optionId: string;
    votes: number;
    percentage: number;
  }[];
}
