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
          <p className="mt-4 text-gray-600">Loading LinkedIn Executive Suite...</p>
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
                LinkedIn Executive Suite
              </h1>
              <p className="text-gray-600">
                AI-powered content intelligence for C-suite professionals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Executive AI Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Executive Preview</span>
              </div>
              <button
                onClick={generateContent}
                disabled={generating}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Zap size={16} />
                <span>{generating ? 'Generating Executive Content...' : 'Generate Executive Content'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
            { id: 'content', label: 'Content Strategy', icon: Lightbulb },
            { id: 'calendar', label: 'Executive Calendar', icon: Calendar },
            { id: 'analytics', label: 'Performance Intelligence', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
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
            {/* Executive Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Content Portfolio</h3>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.totalPosts}</div>
                <div className="text-sm text-green-600">Strategic content pieces</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Executive Queue</h3>
                  <Eye className="text-blue-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.pendingPosts}</div>
                <div className="text-sm text-blue-600">Awaiting executive approval</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Scheduled Presence</h3>
                  <Calendar className="text-purple-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{sheetData.scheduledPosts}</div>
                <div className="text-sm text-purple-600">Auto-deployment active</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">AI Intelligence</h3>
                  <Target className="text-orange-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">Executive</div>
                <div className="text-sm text-orange-600">AI strategy engine running</div>
              </div>
            </div>

            {/* Executive Content Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Executive Content Pipeline</h3>
              <div className="space-y-4">
                {sheetData.posts.slice(0, 5).map((post, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-r">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {post.scheduledFor || 'Pending executive approval'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status === 'Pending' ? 'Executive Review' : post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2 leading-relaxed">
                      {post.postDescription ? post.postDescription.substring(0, 120) + '...' : 'Executive content pending'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">{post.cta}</span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{post.pillar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Strategy */}
        {activeTab === 'content' && sheetData && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Executive Content Strategy</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Content Description</th>
                    <th className="text-left py-3 px-4">Strategy Pillar</th>
                    <th className="text-left py-3 px-4">Executive Status</th>
                    <th className="text-left py-3 px-4">Deployment Schedule</th>
                    <th className="text-left py-3 px-4">Engagement CTA</th>
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
                          {post.pillar || 'Strategic'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status === 'Pending' ? 'Executive Review' : post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {post.scheduledFor || 'Awaiting approval'}
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

        {/* Executive Calendar */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Executive Content Calendar</h3>
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
                      Strategic Content
                    </div>
                  )}
                  {i % 4 === 0 && (
                    <div className="bg-green-100 text-green-800 text-xs p-1 rounded">
                      Executive Showcase
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Intelligence */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Executive Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Executive Engagement Rate</span>
                  <span className="font-semibold text-green-600">4.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C-Suite Profile Views</span>
                  <span className="font-semibold text-blue-600">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Strategic Connections</span>
                  <span className="font-semibold text-purple-600">189</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thought Leadership Impact</span>
                  <span className="font-semibold text-orange-600">High</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Intelligence</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Top Performing Strategy</span>
                  <span className="font-semibold text-green-600">Executive Insights</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Optimal Executive Hours</span>
                  <span className="font-semibold text-blue-600">9:00 AM - 11:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Content Portfolio Size</span>
                  <span className="font-semibold text-purple-600">{sheetData?.totalPosts || 0} pieces</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Efficiency Score</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive CTA Footer */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready for Executive-Level LinkedIn Presence?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            The LinkedIn Executive Suite delivers AI-powered content strategy, automated posting, and performance analytics. 
            Built for C-suite professionals who demand results without the time investment.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule Executive Consultation
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View Executive Pricing
            </button>
          </div>
          <div className="mt-6 text-sm text-blue-200">
            Starting at $5,000 setup + $1,500/month for complete executive LinkedIn management
          </div>
        </div>
      </div>
    </div>
  );
}