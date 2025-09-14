'use client';

import { useState } from 'react';
import { FrameHeader } from '../components/FrameHeader';
import { Navigation } from '../components/Navigation';
import { VoterManagement } from '../components/VoterManagement';
import { PollCreation } from '../components/PollCreation';
import { VotingInterface } from '../components/VotingInterface';
import { ResultsDisplay } from '../components/ResultsDisplay';

type ActiveView = 'voters' | 'create' | 'vote' | 'results';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('voters');
  const [currentPoll, setCurrentPoll] = useState<any>(null);

  const renderActiveView = () => {
    switch (activeView) {
      case 'voters':
        return <VoterManagement />;
      case 'create':
        return <PollCreation onPollCreated={setCurrentPoll} />;
      case 'vote':
        return <VotingInterface poll={currentPoll} />;
      case 'results':
        return <ResultsDisplay poll={currentPoll} />;
      default:
        return <VoterManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <FrameHeader />
        
        <div className="flex flex-col lg:flex-row">
          {/* Navigation Sidebar */}
          <div className="lg:w-80 bg-civic-blue p-4">
            <Navigation 
              activeView={activeView} 
              onViewChange={setActiveView}
              currentPoll={currentPoll}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="animate-fade-in">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
