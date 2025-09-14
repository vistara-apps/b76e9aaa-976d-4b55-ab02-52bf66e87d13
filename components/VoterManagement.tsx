'use client';

import { useState, useEffect } from 'react';
import { Plus, UserCheck, UserX, Search, Upload } from 'lucide-react';
import { Voter, VoterStatus } from '../lib/types';

export function VoterManagement() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newVoterFid, setNewVoterFid] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch voters on component mount
  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/voters');
      const data = await response.json();

      if (data.success) {
        setVoters(data.data);
      } else {
        setError(data.error || 'Failed to fetch voters');
      }
    } catch (err) {
      setError('Failed to fetch voters');
      console.error('Error fetching voters:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVoters = voters.filter(voter =>
    voter.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.fid.includes(searchTerm) ||
    voter.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addVoter = async () => {
    if (!newVoterFid.trim()) return;

    try {
      setIsAdding(true);
      const response = await fetch('/api/voters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid: newVoterFid,
          displayName: `User ${newVoterFid}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVoters([...voters, data.data]);
        setNewVoterFid('');
      } else {
        setError(data.error || 'Failed to add voter');
      }
    } catch (err) {
      setError('Failed to add voter');
      console.error('Error adding voter:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const updateVoterStatus = async (voterId: string, status: VoterStatus) => {
    try {
      const voter = voters.find(v => v.voterId === voterId);
      if (!voter) return;

      const newTags = voter.statusTags.includes(status)
        ? voter.statusTags.filter(tag => tag !== status)
        : [...voter.statusTags, status];

      const response = await fetch('/api/voters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterId,
          statusTags: newTags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVoters(voters.map(v =>
          v.voterId === voterId ? data.data : v
        ));
      } else {
        setError(data.error || 'Failed to update voter status');
      }
    } catch (err) {
      setError('Failed to update voter status');
      console.error('Error updating voter status:', err);
    }
  };

  const getStatusColor = (status: VoterStatus) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'voted': return 'bg-green-100 text-green-800';
      case 'eligible': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Record Voters</h2>
        <div className="card text-center py-12">
          <div className="w-8 h-8 border-4 border-civic-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Record Voters</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Import List</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add New Voter */}
      <div className="card">
        <h3 className="font-semibold mb-4">Add New Voter</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter Farcaster ID or wallet address"
            value={newVoterFid}
            onChange={(e) => setNewVoterFid(e.target.value)}
            className="input-field flex-1"
          />
          <button
            onClick={addVoter}
            disabled={isAdding}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search voters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Voter List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Registered Voters ({voters.length})</h3>
          <div className="text-sm text-gray-600">
            {voters.filter(v => v.statusTags.includes('voted')).length} voted
          </div>
        </div>

        <div className="space-y-3">
          {filteredVoters.map((voter) => (
            <div
              key={voter.voterId}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">{voter.displayName}</div>
                  <div className="text-sm text-gray-500">FID: {voter.fid}</div>
                </div>
                {voter.walletAddress && (
                  <div className="text-sm text-gray-400 mt-1">
                    {voter.walletAddress}
                  </div>
                )}
                <div className="flex space-x-2 mt-2">
                  {voter.statusTags.map((status) => (
                    <span
                      key={status}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => updateVoterStatus(voter.voterId, 'contacted')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Mark as contacted"
                >
                  <UserCheck className="h-4 w-4" />
                </button>
                <button
                  onClick={() => updateVoterStatus(voter.voterId, 'eligible')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                  title="Mark as eligible"
                >
                  <UserCheck className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
