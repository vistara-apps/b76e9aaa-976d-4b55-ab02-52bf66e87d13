'use client';

import { Users, Plus, Vote, BarChart3, CheckCircle } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: 'voters' | 'create' | 'vote' | 'results') => void;
  currentPoll: any;
}

export function Navigation({ activeView, onViewChange, currentPoll }: NavigationProps) {
  const navItems = [
    {
      id: 'voters',
      label: 'Record Voters',
      icon: Users,
      description: 'Manage eligible voters',
    },
    {
      id: 'create',
      label: 'Create Poll',
      icon: Plus,
      description: 'Start a new poll',
    },
    {
      id: 'vote',
      label: 'Vote Exercise',
      icon: Vote,
      description: 'Cast your vote',
      disabled: !currentPoll,
    },
    {
      id: 'results',
      label: 'View Results',
      icon: BarChart3,
      description: 'See poll results',
      disabled: !currentPoll,
    },
  ];

  return (
    <nav className="space-y-2">
      <h2 className="text-white font-semibold text-lg mb-4">Navigation</h2>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const isDisabled = item.disabled;
        
        return (
          <button
            key={item.id}
            onClick={() => !isDisabled && onViewChange(item.id as any)}
            disabled={isDisabled}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-white text-civic-blue shadow-md' 
                : isDisabled
                  ? 'text-white/50 cursor-not-allowed'
                  : 'text-white hover:bg-white/20'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className={`text-sm ${isActive ? 'text-civic-blue/70' : 'text-white/70'}`}>
                  {item.description}
                </div>
              </div>
              {isActive && <CheckCircle className="h-4 w-4 ml-auto" />}
            </div>
          </button>
        );
      })}
      
      {currentPoll && (
        <div className="mt-6 p-3 bg-white/10 rounded-lg">
          <h3 className="text-white font-medium text-sm mb-2">Active Poll</h3>
          <p className="text-white/80 text-sm">{currentPoll.title}</p>
          <p className="text-white/60 text-xs mt-1">
            {currentPoll.options?.length || 0} options
          </p>
        </div>
      )}
    </nav>
  );
}
