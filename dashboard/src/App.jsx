import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import RightPanel from './components/RightPanel';
import IdeaBlock from './components/IdeaBlock';
import IdeaForm from './components/IdeaForm';
import IdeaDetail from './components/IdeaDetail';
import SettingsPanel from './components/SettingsPanel';
import StatsVisuals from './components/StatsVisuals';

const API_BASE = '/api';

const fetchIdeas = async (searchQuery, categoryFilter, difficultyFilter, marketFilter, sortBy, token) => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (categoryFilter !== 'All') params.append('category', categoryFilter);
    if (difficultyFilter !== 'All') params.append('difficulty', difficultyFilter);
    if (marketFilter !== 'All') params.append('market', marketFilter);
    if (sortBy) params.append('sort', sortBy);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE}/ideas?${params}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Fetch ideas error:', error);
    throw error;
  }
};

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [marketFilter, setMarketFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('auth_user') || 'null'));

  const refreshIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedIdeas = await fetchIdeas(searchQuery, categoryFilter, difficultyFilter, marketFilter, sortBy, token);
      setIdeas(fetchedIdeas);
    } catch (err) {
      setError('Failed to load ideas. Is backend running on port 3001?');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, difficultyFilter, marketFilter, sortBy]);

  // Initial load and refetch on filter changes
  useEffect(() => {
    refreshIdeas();
  }, [refreshIdeas]);

  const handleAddIdea = async (newIdea) => {
    if (!token) {
      alert("You need to be logged in to add an idea. Please go to Settings to login.");
      setIsFormOpen(false);
      setActiveTab('Settings');
      return;
    }
    try {
      await axios.post(`${API_BASE}/ideas`, newIdea, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFormOpen(false);
      refreshIdeas(); // Refetch to get new idea
    } catch (error) {
      console.error('Add idea error:', error);
      alert('Failed to add idea');
    }
  };

  const handleUpvote = async (id) => {
    // Optimistic update
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    ));

    try {
      await axios.patch(`${API_BASE}/ideas/${id}/vote`);
      // Refetch for server confirmation (concurrency)
      refreshIdeas();
    } catch (error) {
      console.error('Upvote error:', error);
      // Revert optimistic
      refreshIdeas();
      alert('Failed to upvote');
    }
  };

  const checkSpotlight = (idea) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!idea.title.toLowerCase().includes(q) && !idea.description.toLowerCase().includes(q)) return false;
    }
    if (categoryFilter !== 'All' && idea.category !== categoryFilter) return false;
    if (difficultyFilter !== 'All' && idea.difficulty !== parseInt(difficultyFilter)) return false;
    if (marketFilter !== 'All' && idea.market !== marketFilter) return false;
    return true;
  };

  const isFiltering = searchQuery !== '' || categoryFilter !== 'All' || difficultyFilter !== 'All' || marketFilter !== 'All';

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="text-lg text-slate-600">Loading ideas from backend...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] text-slate-800 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      
      {/* 1. Left Sidebar */}
      <Sidebar 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative min-w-0 bg-white/40">
        
        {/* 2. Sticky Topbar Command Center */}
        <Topbar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          setIsFormOpen={setIsFormOpen}
          difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
          marketFilter={marketFilter} setMarketFilter={setMarketFilter}
          sortBy={sortBy} setSortBy={setSortBy}
        />

        {/* 3. Dynamic Current View */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'Settings' && (
             <SettingsPanel token={token} setToken={setToken} user={user} setUser={setUser} />
          )}

          {activeTab === 'Insights' && (
             <div className="p-6 lg:p-10 w-full animate-fade-in mx-auto max-w-7xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ecosystem Insights</h2>
                  <p className="text-slate-500 mt-2">Data visualization of the current startup ideas repository.</p>
                </div>
                <StatsVisuals ideas={ideas} />
             </div>
          )}

          {(activeTab === 'Overview' || activeTab === 'Explore') && (
            <div className="flex w-full h-full max-w-[1600px] mx-auto animate-fade-in">
              
              {/* Center Grid */}
              <div className="flex-1 min-w-0 p-6 lg:p-8 xl:p-10 relative">
                 
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                   <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900">{activeTab === 'Explore' ? 'Explore Ideas' : 'Idea Repository'}</h2>
                     <p className="text-sm text-slate-500 mt-1 font-medium">{ideas.length} total concepts in workspace</p>
                   </div>
                   
                   {isFiltering && (
                      <button 
                        onClick={() => {
                          setSearchQuery(''); 
                          setCategoryFilter('All');
                          setDifficultyFilter('All'); 
                          setMarketFilter('All');
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Clear Filters
                      </button>
                   )}
                 </div>

                 {ideas.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="text-slate-500 font-medium mb-4">No ideas found.</p>
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Create First Idea
                      </button>
                   </div>
                 ) : (
                   <motion.div 
                     layout
                     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5"
                   >
                     <AnimatePresence>
                       {ideas.map((idea) => {
                         const isSpotlighted = !isFiltering || checkSpotlight(idea);
                         return (
                           <motion.div 
                             key={idea.id} 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -20 }}
                             className={!isSpotlighted ? 'hidden' : 'block'} 
                             onClick={() => setSelectedIdeaId(idea.id)}
                           >
                             <IdeaBlock 
                               idea={idea} 
                               onUpvote={handleUpvote} 
                               isSpotlight={isSpotlighted}
                             />
                           </motion.div>
                         );
                       })}
                     </AnimatePresence>

                     {/* Empty State when filters yield zero results */}
                     {isFiltering && ideas.filter(checkSpotlight).length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-slate-50/80 rounded-xl border border-slate-100">
                          No matching ideas found for your filters.
                        </div>
                     )}
                   </motion.div>
                 )}
              </div>

              {/* Right Panel - only on Overview */}
              {activeTab === 'Overview' && <RightPanel ideas={ideas} />}

            </div>
          )}
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <AnimatePresence>
        {isFormOpen && (
          <IdeaForm 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddIdea} 
            existingTitles={ideas.map(i => i.title.toLowerCase())}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIdeaId && selectedIdea && (
          <IdeaDetail 
            idea={selectedIdea} 
            onClose={() => setSelectedIdeaId(null)}
            onUpvote={handleUpvote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
