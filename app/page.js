'use client'

import { useState, useEffect } from 'react';
import { Calendar, Settings, Zap, TrendingUp, Eye, Plus, Play, Pause, Edit3, Globe, Target, Lightbulb, BarChart3 } from 'lucide-react';

export default function LinkedInAutomationDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSheetData();
  }, []);

  const fetchSheetData = async () => {
    try {
      const response = await fetch('/api/sheets');
      const data = await response.json();
      setSheetData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

 // In your page.js, replace the generateContent function with this:

const generateContent = async () => {
  setGenerating(true);
  try {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 7 })
    });
    const data = await response.json();

    if (data.ideas) {
      // Update the local state immediately with the new content
      setSheetData(prevData => ({
        ...prevData,
        totalPosts: (prevData?.totalPosts || 0) + data.ideas.length,
        pendingPosts: (prevData?.pendingPosts || 0) + data.ideas.length,
        posts: [
          ...data.ideas.map(idea => ({
            postDescription: idea.postDescription,
            pillar: idea.pillar,
            status: 'Pending',
            scheduledFor: idea.scheduledFor,
            cta: idea.cta,
            hashtags: idea.hashtags
          })),
          ...(prevData?.posts || [])
        ]
      }));
    }

    console.log('Generated content:', data);
  } catch (error) {
    console.error('Error generating content:', error);
  } finally {
    setGenerating(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading LinkedIn Automation Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                LinkedIn Automation Engine
              </h1>
              <p className="text-gray-600">
                Professional content automation system powered by n8n
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Demo Mode</span>
              </div>
              <button
                onClick={generateContent}
                disabled={generating}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Zap size={16} />
                <span>{generating ? 'Generating...' : 'Generate Content'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'content', label: 'Content Pipeline', icon: Lightbulb },
            { id: 'calendar', label: 'Schedule', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && sheetData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Total Posts</h3>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.totalPosts}</div>
                <div className="text-sm text-green-600">Connected to Google Sheets</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Pending Posts</h3>
                  <Eye className="text-blue-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.pendingPosts}</div>
                <div className="text-sm text-blue-600">Ready for processing</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Scheduled Posts</h3>
                  <Calendar className="text-purple-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.scheduledPosts}</div>
                <div className="text-sm text-purple-600">Automated posting</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Automation Status</h3>
                  <Target className="text-orange-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">Active</div>
                <div className="text-sm text-orange-600">n8n workflow running</div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {sheetData.posts.slice(0, 5).map((post, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        {post.scheduledFor || 'Not scheduled'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">
                      {post.postDescription ? post.postDescription.substring(0, 80) + '...' : 'No description'}
                    </p>
                    <p className="text-xs text-blue-600">{post.cta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Pipeline */}
        {activeTab === 'content' && sheetData && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Post Description</th>
                    <th className="text-left py-3 px-4">Pillar</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Scheduled</th>
                    <th className="text-left py-3 px-4">CTA</th>
                  </tr>
                </thead>
                <tbody>
                  {sheetData.posts.map((post, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{post.postDescription}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {post.pillar || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {post.scheduledFor || 'Not set'}
                      </td>
                      <td className="py-3 px-4 text-sm text-blue-600">
                        {post.cta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Calendar</h3>
            <div className="grid grid-cols-7 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
              {Array.from({length: 28}, (_, i) => (
                <div key={i} className="border rounded-lg p-2 min-h-[100px]">
                  <div className="text-sm text-gray-600 mb-2">{i + 1}</div>
                  {i % 3 === 0 && (
                    <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1">
                      Educational
                    </div>
                  )}
                  {i % 4 === 0 && (
                    <div className="bg-green-100 text-green-800 text-xs p-1 rounded">
                      Case Study
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Engagement Rate</span>
                  <span className="font-semibold text-green-600">3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views (This Month)</span>
                  <span className="font-semibold text-blue-600">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Website Clicks</span>
                  <span className="font-semibold text-purple-600">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Connections</span>
                  <span className="font-semibold text-orange-600">23</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Performing Pillar</span>
                  <span className="font-semibold text-green-600">Showcase</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Optimal Posting Time</span>
                  <span className="font-semibold text-blue-600">11:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts This Month</span>
                  <span className="font-semibold text-purple-600">{sheetData?.totalPosts || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Automate Your LinkedIn Like This?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            This dashboard is powered by n8n automation workflows. Every post, every metric, every insight - fully automated.
            Want something similar for your business? Let&apos;s build your automation system together.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
              View My Automation Services
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}/ /   E S L i n t   f i x   a p p l i e d 
 
 