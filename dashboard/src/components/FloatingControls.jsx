import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ["SaaS", "E-commerce", "Mobile App", "AI/ML", "Fintech", "Healthtech", "Other"];
const MARKET_OPTIONS = ["Low", "Medium", "High", "Very High"];

export default function FloatingControls({ 
  searchQuery, setSearchQuery, 
  categoryFilter, setCategoryFilter,
  difficultyFilter, setDifficultyFilter,
  marketFilter, setMarketFilter,
  sortBy, setSortBy
}) {
  const [activeTab, setActiveTab] = useState(null); // 'search' | 'filter' | 'sort' | null

  const toggleTab = (tab) => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  const isActive = searchQuery || categoryFilter !== 'All' || difficultyFilter !== 'All' || marketFilter !== 'All';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      
      {/* Sleek MacOS-like Expanded Panel */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-[90vw] max-w-sm pointer-events-auto"
          >
            {activeTab === 'search' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Spotlight search ideas..."
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl py-2 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner placeholder:text-slate-400 text-sm"
                />
              </div>
            )}

            {activeTab === 'filter' && (
              <div className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Category</label>
                   <select 
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                     className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                   >
                     <option value="All">All Categories</option>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Difficulty</label>
                     <select 
                       value={difficultyFilter}
                       onChange={(e) => setDifficultyFilter(e.target.value)}
                       className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                     >
                       <option value="All">Any Size</option>
                       <option value="1">1 - Dust</option>
                       <option value="2">2 - Pebble</option>
                       <option value="3">3 - Rock</option>
                       <option value="4">4 - Boulder</option>
                       <option value="5">5 - Mountain</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Market</label>
                     <select 
                       value={marketFilter}
                       onChange={(e) => setMarketFilter(e.target.value)}
                       className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                     >
                       <option value="All">Any Potential</option>
                       {MARKET_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'sort' && (
              <div className="space-y-1">
                 <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Sort Universe</label>
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                   <button 
                     onClick={() => setSortBy('newest')}
                     className={`flex-1 py-1.5 text-sm rounded-lg transition-all font-medium ${sortBy === 'newest' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Latest
                   </button>
                   <button 
                     onClick={() => setSortBy('popular')}
                     className={`flex-1 py-1.5 text-sm rounded-lg transition-all font-medium ${sortBy === 'popular' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Popular
                   </button>
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple-esque Floating Dock */}
      <div className="pointer-events-auto bg-white/70 backdrop-blur-xl px-2 py-2 rounded-full flex items-center gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80">
        
        <button
          onClick={() => toggleTab('search')}
          className={`relative p-3 rounded-full transition-colors flex items-center justify-center ${activeTab === 'search' ? 'bg-slate-200/50 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
        >
          <Search size={18} />
          {searchQuery && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />}
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          onClick={() => toggleTab('filter')}
          className={`relative p-3 rounded-full transition-colors flex items-center justify-center ${activeTab === 'filter' ? 'bg-slate-200/50 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
        >
          <SlidersHorizontal size={18} />
          {(categoryFilter !== 'All' || difficultyFilter !== 'All' || marketFilter !== 'All') && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
          )}
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          onClick={() => toggleTab('sort')}
          className={`p-3 rounded-full transition-colors flex items-center justify-center ${activeTab === 'sort' ? 'bg-slate-200/50 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
        >
          <ArrowUpDown size={18} />
        </button>

        {/* Clear All button - only visible if active filters */}
        {isActive && (
          <>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button
               onClick={() => {
                 setSearchQuery('');
                 setCategoryFilter('All');
                 setDifficultyFilter('All');
                 setMarketFilter('All');
               }}
               className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
               Clear
            </button>
          </>
        )}
      </div>

    </div>
  );
}
