'use client';

import { useState } from 'react';
import { BarChart3, PieChart, Download, Share2, TrendingUp } from 'lucide-react';
import { Poll } from '../lib/types';
import { formatDate, calculatePercentage } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ResultsDisplayProps {
  poll: Poll | null;
}

export function ResultsDisplay({ poll }: ResultsDisplayProps) {
  const [viewType, setViewType] = useState<'bar' | 'pie'>('bar');

  if (!poll) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">View Results</h2>
        <div className="card text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Poll Results</h3>
          <p className="text-gray-600">Create and run a poll to see results here.</p>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const chartData = poll.options.map((option, index) => ({
    name: option.text,
    votes: option.votes,
    percentage: calculatePercentage(option.votes, totalVotes),
    fill: `hsl(${200 + index * 30}, 70%, ${60 - index * 5}%)`,
  }));

  const winningOption = poll.options.reduce((prev, current) => 
    current.votes > prev.votes ? current : prev
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Poll Results</h2>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('bar')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewType === 'bar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('pie')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewType === 'pie' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <PieChart className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Poll Summary */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{poll.title}</h3>
            {poll.description && (
              <p className="text-gray-600 mb-2">{poll.description}</p>
            )}
            <div className="text-sm text-gray-500">
              Created {formatDate(poll.createdAt)} • Status: {poll.status}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-civic-blue">{totalVotes}</div>
            <div className="text-sm text-gray-600">Total Votes</div>
          </div>
        </div>

        {/* Winner Announcement */}
        {totalVotes > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Leading Option</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-medium text-green-900">{winningOption.text}</div>
              <div className="text-sm text-green-700">
                {winningOption.votes} votes ({calculatePercentage(winningOption.votes, totalVotes)}%)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Visualization */}
      <div className="card">
        <h4 className="font-semibold mb-4">Real-time Results Chart</h4>
        
        {totalVotes > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Votes']}
                    labelFormatter={(label) => `Option: ${label}`}
                  />
                  <Bar dataKey="votes" fill="hsl(200, 70%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <RechartsPieChart>
                  <Tooltip 
                    formatter={(value, name) => [value, 'Votes']}
                  />
                  <RechartsPieChart
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    <Pie
                      data={chartData}
                      dataKey="votes"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </RechartsPieChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No votes yet. Results will appear here once voting begins.</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Results Table */}
      <div className="card">
        <h4 className="font-semibold mb-4">Detailed Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Option</th>
                <th className="text-right py-3 px-2">Votes</th>
                <th className="text-right py-3 px-2">Percentage</th>
                <th className="text-left py-3 px-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {poll.options
                .sort((a, b) => b.votes - a.votes)
                .map((option, index) => {
                  const percentage = calculatePercentage(option.votes, totalVotes);
                  return (
                    <tr key={option.id} className="border-b last:border-b-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          {index === 0 && totalVotes > 0 && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-semibold">
                        {option.votes}
                      </td>
                      <td className="text-right py-3 px-2">
                        {percentage}%
                      </td>
                      <td className="py-3 px-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-civic-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-civic-blue">{totalVotes}</div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-civic-blue">{poll.options.length}</div>
          <div className="text-sm text-gray-600">Options</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-civic-blue">
            {totalVotes > 0 ? Math.max(...poll.options.map(o => calculatePercentage(o.votes, totalVotes))) : 0}%
          </div>
          <div className="text-sm text-gray-600">Highest %</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-civic-blue">
            {poll.status === 'active' ? 'Live' : 'Closed'}
          </div>
          <div className="text-sm text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
}
