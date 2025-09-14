import { Poll, Voter, Vote } from '../types';

// In-memory storage for demo purposes
// In production, this would be replaced with a database or blockchain storage
export const dataStore = {
  polls: [] as Poll[],
  voters: [] as Voter[],
  votes: [] as Vote[],
};

// Helper functions to manage data
export const addPoll = (poll: Poll) => {
  dataStore.polls.push(poll);
};

export const getPoll = (pollId: string) => {
  return dataStore.polls.find(p => p.pollId === pollId);
};

export const getPolls = (organizerFid?: string, status?: string) => {
  let filteredPolls = dataStore.polls;

  if (organizerFid) {
    filteredPolls = filteredPolls.filter(poll => poll.organizerFid === organizerFid);
  }

  if (status) {
    filteredPolls = filteredPolls.filter(poll => poll.status === status);
  }

  return filteredPolls;
};

export const updatePoll = (pollId: string, updates: Partial<Poll>) => {
  const index = dataStore.polls.findIndex(p => p.pollId === pollId);
  if (index !== -1) {
    dataStore.polls[index] = { ...dataStore.polls[index], ...updates };
    return dataStore.polls[index];
  }
  return null;
};

export const deletePoll = (pollId: string) => {
  const index = dataStore.polls.findIndex(p => p.pollId === pollId);
  if (index !== -1) {
    dataStore.polls.splice(index, 1);
    return true;
  }
  return false;
};

export const addVoter = (voter: Voter) => {
  dataStore.voters.push(voter);
};

export const getVoter = (voterId: string) => {
  return dataStore.voters.find(v => v.voterId === voterId);
};

export const getVoters = (fid?: string, status?: string) => {
  let filteredVoters = dataStore.voters;

  if (fid) {
    filteredVoters = filteredVoters.filter(voter => voter.fid === fid);
  }

  if (status) {
    filteredVoters = filteredVoters.filter(voter =>
      voter.statusTags.includes(status as any)
    );
  }

  return filteredVoters;
};

export const updateVoter = (voterId: string, updates: Partial<Voter>) => {
  const index = dataStore.voters.findIndex(v => v.voterId === voterId);
  if (index !== -1) {
    dataStore.voters[index] = { ...dataStore.voters[index], ...updates };
    return dataStore.voters[index];
  }
  return null;
};

export const addVote = (vote: Vote) => {
  dataStore.votes.push(vote);
};

export const getVotes = (pollId?: string, voterFid?: string) => {
  let filteredVotes = dataStore.votes;

  if (pollId) {
    filteredVotes = filteredVotes.filter(vote => vote.pollId === pollId);
  }

  if (voterFid) {
    filteredVotes = filteredVotes.filter(vote => vote.voterFid === voterFid);
  }

  return filteredVotes;
};

export const hasVoted = (pollId: string, voterFid: string) => {
  return dataStore.votes.some(vote => vote.pollId === pollId && vote.voterFid === voterFid);
};

