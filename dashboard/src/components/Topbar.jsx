import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';

export default function Topbar({ 
  searchQuery, setSearchQuery, 
  setIsFormOpen, 
  difficultyFilter, setDifficultyFilter,
  marketFilter, setMarketFilter,
  sortBy, setSortBy
}) {
  return (
    <header className="sticky top-0 z-20 w-full min-h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
      
      {/* Global Search */}
      <div className="flex-1 min-w-[200px] max-w-xl relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ideas, problems, or tags... (Press /)"
          className="w-full bg-slate-100/50 border border-slate-200/60 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-inner"
        />
        {/* Shortcut hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 md:opacity-100 pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/50 rounded border border-slate-300/50">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/50 rounded border border-slate-300/50">K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        
        {/* Dense Filters Line */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-600 font-medium tracking-tight hover:bg-slate-100 px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">Any Diff.</option>
              <option value="1">Lvl 1 - Dust</option>
              <option value="2">Lvl 2 - Pebble</option>
              <option value="3">Lvl 3 - Rock</option>
              <option value="4">Lvl 4 - Boulder</option>
              <option value="5">Lvl 5 - Mountain</option>
            </select>
            
            <div className="w-px h-4 bg-slate-300/60" />

            <select 
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-600 font-medium tracking-tight hover:bg-slate-100 px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">Any Market</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
               <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>

            <div className="w-px h-4 bg-slate-300/60" />

             {/* Modern Toggle for Sort */}
            <div className="flex bg-slate-100/80 p-0.5 rounded-md border border-slate-200/50">
               <button 
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${sortBy === 'newest' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Newest
               </button>
               <button 
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${sortBy === 'popular' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Popular
               </button>
            </div>
        </div>

        {/* Mobile Filter Button */}
        <button className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors">
          <Filter size={16} />
        </button>

        <div className="w-px h-6 bg-slate-200/80 hidden sm:block" />

        {/* Primary CTA */}
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 hover:shadow-lg shadow-blue-600/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 border border-blue-500"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Idea</span>
        </button>

      </div>
    </header>
  );
}
