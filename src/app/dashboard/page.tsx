'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/googleSheets';
import { NewsArticle } from '@/lib/newsScraper';
import { ConversationStarter } from '@/lib/aiPrompt';

interface LeadWithData extends Lead {
  articles?: NewsArticle[];
  conversationStarters?: ConversationStarter[];
  isLoading?: boolean;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<LeadWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate');
      const data = await response.json();
      
      if (response.ok) {
        setLeads(data.leads.map((lead: Lead) => ({ ...lead, isLoading: false })));
      } else {
        setError(data.error || 'Failed to fetch leads');
      }
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const generateForLead = async (lead: LeadWithData) => {
    try {
      setLeads(prev => prev.map(l => 
        l.name === lead.name ? { ...l, isLoading: true } : l
      ));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadName: lead.name }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setLeads(prev => prev.map(l => 
          l.name === lead.name 
            ? { 
                ...l, 
                articles: data.articles, 
                conversationStarters: data.conversationStarters,
                isLoading: false 
              } 
            : l
        ));
      } else {
        setError(data.error || 'Failed to generate conversation starters');
        setLeads(prev => prev.map(l => 
          l.name === lead.name ? { ...l, isLoading: false } : l
        ));
      }
    } catch {
      setError('Failed to generate conversation starters');
      setLeads(prev => prev.map(l => 
        l.name === lead.name ? { ...l, isLoading: false } : l
      ));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={fetchLeads}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Memory BD AI - Lead Conversation Starter</h1>
          <p className="mt-2 text-gray-600">Generate personalized conversation starters for your CMO leads</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              CMO Leads ({leads.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Click &quot;Generate&quot; to create conversation starters based on recent news
            </p>
          </div>

          <div className="border-t border-gray-200">
            {leads.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No leads found. Please check your Google Sheet configuration.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <div key={lead.name} className="px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.role} at {lead.org}</p>
                        {lead.linkedin && (
                          <a 
                            href={lead.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => generateForLead(lead)}
                        disabled={lead.isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {lead.isLoading ? 'Generating...' : 'Generate'}
                      </button>
                    </div>

                    {lead.articles && lead.articles.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Recent News ({lead.articles.length})</h5>
                        <div className="space-y-2">
                          {lead.articles.map((article, index) => (
                            <div key={index} className="text-sm">
                              <a 
                                href={article.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {article.title}
                              </a>
                              <span className="text-gray-500 ml-2">({article.pubDate})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lead.conversationStarters && lead.conversationStarters.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          Conversation Starters ({lead.conversationStarters.length})
                        </h5>
                        <div className="space-y-3">
                          {lead.conversationStarters.map((starter) => (
                            <div key={starter.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  starter.tone === 'professional' ? 'bg-blue-100 text-blue-800' :
                                  starter.tone === 'casual' ? 'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {starter.tone}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(starter.text)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Copy to clipboard"
                                >
                                  📋
                                </button>
                              </div>
                              <p className="text-sm text-gray-900 mb-2">{starter.text}</p>
                              <p className="text-xs text-gray-500">{starter.context}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 