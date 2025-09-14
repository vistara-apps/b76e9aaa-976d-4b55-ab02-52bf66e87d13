'use client';

import { useState } from 'react';
import { Check, Clock, Users, Lock } from 'lucide-react';
import { Poll, Vote } from '../lib/types';
import { generateId, formatDate } from '../lib/utils';

interface VotingInterfaceProps {
  poll: Poll | null;
}

export function VotingInterface({ poll }: VotingInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  if (!poll) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Vote Exercise</h2>
        <div className="card text-center py-12">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Poll</h3>
          <p className="text-gray-600">Create a poll first to start voting.</p>
        </div>
      </div>
    );
  }

  const submitVote = async () => {
    if (!selectedOption || hasVoted || !poll) return;

    setIsVoting(true);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll.pollId,
          voterFid: '9152', // Mock voter FID - in production, get from auth
          selectedOption,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh poll data to get updated vote counts
        const pollResponse = await fetch(`/api/polls/${poll.pollId}`);
        const pollData = await pollResponse.json();

        if (pollData.success) {
          // Update the poll with new data
          Object.assign(poll, pollData.data);
          setHasVoted(true);
        }
      } else {
        console.error('Failed to submit vote:', data.error);
        // You could add error state here
      }

    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Vote Exercise</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Poll Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{poll.title}</h3>
          {poll.description && (
            <p className="text-gray-600">{poll.description}</p>
          )}
          <div className="text-sm text-gray-500 mt-2">
            Created {formatDate(poll.createdAt)}
          </div>
        </div>

        {/* Voting Options */}
        <div className="space-y-3 mb-6">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isSelected = selectedOption === option.id;
            
            return (
              <div
                key={option.id}
                className={`
                  relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-civic-blue bg-civic-blue/5' 
                    : hasVoted 
                      ? 'border-gray-200 cursor-not-allowed' 
                      : 'border-gray-200 hover:border-civic-blue/50'
                  }
                `}
                onClick={() => !hasVoted && setSelectedOption(option.id)}
              >
                {/* Vote Progress Bar (shown after voting) */}
                {hasVoted && (
                  <div 
                    className="absolute inset-0 bg-civic-blue/10 rounded-lg transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-civic-blue bg-civic-blue' 
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                  
                  {hasVoted && (
                    <div className="text-right">
                      <div className="font-semibold text-civic-blue">{percentage}%</div>
                      <div className="text-sm text-gray-500">{option.votes} votes</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vote Button */}
        {!hasVoted ? (
          <button
            onClick={submitVote}
            disabled={!selectedOption || isVoting}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
              ${selectedOption && !isVoting
                ? 'bg-civic-blue hover:bg-civic-blue-dark text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isVoting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting Vote...</span>
              </div>
            ) : (
              'Cast Your Vote'
            )}
          </button>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <Check className="h-5 w-5" />
              <span className="font-medium">Vote Submitted Successfully!</span>
            </div>
          </div>
        )}

        {/* Vote Stats */}
        {hasVoted && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-civic-blue">{totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-civic-blue">{poll.options.length}</div>
                <div className="text-sm text-gray-600">Options</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-civic-blue">
                  {totalVotes > 0 ? Math.round((totalVotes / 100) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Participation</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
