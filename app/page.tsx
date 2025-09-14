'use client';

import { useState, useEffect } from 'react';
import { FrameHeader } from '../components/FrameHeader';
import { Navigation } from '../components/Navigation';
import { VoterManagement } from '../components/VoterManagement';
import { PollCreation } from '../components/PollCreation';
import { VotingInterface } from '../components/VotingInterface';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Poll } from '../lib/types';

type ActiveView = 'voters' | 'create' | 'vote' | 'results';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('voters');
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch polls on component mount
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/polls');
      const data = await response.json();

      if (data.success) {
        setPolls(data.data);
        // Set the most recent poll as current if none is selected
        if (!currentPoll && data.data.length > 0) {
          setCurrentPoll(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePollCreated = (newPoll: Poll) => {
    setPolls(prev => [newPoll, ...prev]);
    setCurrentPoll(newPoll);
    setActiveView('vote'); // Switch to voting view after creation
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'voters':
        return <VoterManagement />;
      case 'create':
        return <PollCreation onPollCreated={handlePollCreated} />;
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
              polls={polls}
              onPollSelect={setCurrentPoll}
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
