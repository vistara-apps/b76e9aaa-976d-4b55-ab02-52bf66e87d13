'use client';

import { useMiniKit } from '@coinbase/minikit';
import { Identity } from '@coinbase/onchainkit/identity';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { Vote, Users } from 'lucide-react';

export function FrameHeader() {
  const { user } = useMiniKit();

  return (
    <header className="bg-civic-blue text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Vote className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Civic Ballot</h1>
            <p className="text-sm text-white/80">Secure Community Voting</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <Identity 
                address={user.address}
                className="text-white"
              />
            </div>
          )}
          <Wallet className="text-white">
            <div className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-md transition-colors duration-200">
              Connect
            </div>
          </Wallet>
        </div>
      </div>
    </header>
  );
}
