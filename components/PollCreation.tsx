'use client';

import { useState } from 'react';
import { Plus, X, Save, Share2 } from 'lucide-react';
import { Poll, PollOption } from '../lib/types';
import { generateId, validatePollData } from '../lib/utils';

interface PollCreationProps {
  onPollCreated: (poll: Poll) => void;
}

export function PollCreation({ onPollCreated }: PollCreationProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    setError(null);
    
    const validationError = validatePollData(title, options);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);

    try {
      const pollOptions: PollOption[] = options
        .filter(opt => opt.trim())
        .map(opt => ({
          id: generateId(),
          text: opt.trim(),
          votes: 0,
        }));

      const newPoll: Poll = {
        pollId: generateId(),
        organizerFid: '9152', // Mock organizer FID
        title: title.trim(),
        description: description.trim(),
        options: pollOptions,
        createdAt: new Date(),
        status: 'active',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onPollCreated(newPoll);
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Create New Poll</h2>
      </div>

      <div className="card space-y-6">
        {/* Poll Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your poll question..."
            className="input-field"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/200 characters
          </div>
        </div>

        {/* Poll Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional context for your poll..."
            className="input-field h-24 resize-none"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {description.length}/500 characters
          </div>
        </div>

        {/* Poll Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options *
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="input-field"
                    maxLength={100}
                  />
                </div>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-3 flex items-center space-x-2 text-civic-blue hover:text-civic-blue-dark transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={createPoll}
            disabled={isCreating}
            className="btn-primary flex items-center space-x-2 flex-1"
          >
            <Save className="h-4 w-4" />
            <span>{isCreating ? 'Creating...' : 'Create Poll'}</span>
          </button>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Preview */}
      {title && (
        <div className="card">
          <h3 className="font-semibold mb-3">Preview</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-lg mb-2">{title}</h4>
            {description && (
              <p className="text-gray-600 text-sm mb-4">{description}</p>
            )}
            <div className="space-y-2">
              {options.filter(opt => opt.trim()).map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 bg-white rounded border"
                >
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
