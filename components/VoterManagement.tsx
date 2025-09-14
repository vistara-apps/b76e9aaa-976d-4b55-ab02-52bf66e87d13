'use client';

import { useState } from 'react';
import { Plus, UserCheck, UserX, Search, Upload } from 'lucide-react';
import { Voter, VoterStatus } from '../lib/types';
import { generateId } from '../lib/utils';

export function VoterManagement() {
  const [voters, setVoters] = useState<Voter[]>([
    {
      voterId: '1',
      fid: '9152',
      walletAddress: '0x1234...5678',
      statusTags: ['registered', 'eligible'],
      displayName: 'Alice.eth',
    },
    {
      voterId: '2',
      fid: '8421',
      walletAddress: '0x9876...4321',
      statusTags: ['contacted'],
      displayName: 'Bob.base',
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newVoterFid, setNewVoterFid] = useState('');

  const filteredVoters = voters.filter(voter =>
    voter.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.fid.includes(searchTerm) ||
    voter.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addVoter = () => {
    if (!newVoterFid.trim()) return;
    
    const newVoter: Voter = {
      voterId: generateId(),
      fid: newVoterFid,
      statusTags: ['registered'],
      displayName: `User ${newVoterFid}`,
    };
    
    setVoters([...voters, newVoter]);
    setNewVoterFid('');
  };

  const updateVoterStatus = (voterId: string, status: VoterStatus) => {
    setVoters(voters.map(voter => {
      if (voter.voterId === voterId) {
        const newTags = voter.statusTags.includes(status)
          ? voter.statusTags.filter(tag => tag !== status)
          : [...voter.statusTags, status];
        return { ...voter, statusTags: newTags };
      }
      return voter;
    }));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Record Voters</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Import List</span>
        </button>
      </div>

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
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
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
