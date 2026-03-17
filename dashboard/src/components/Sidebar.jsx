import { Home, Compass, BarChart2, Settings, Folder, Hash, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CATEGORIES = ["SaaS", "E-commerce", "Mobile App", "AI/ML", "Fintech", "Healthtech", "Other"];

export default function Sidebar({ categoryFilter, setCategoryFilter, activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 68 : 240 }}
      className="hidden md:flex flex-col h-screen border-r border-slate-200 bg-slate-50 shadow-[2px_0_8px_rgba(0,0,0,0.02)] sticky top-0 shrink-0 z-30 transition-all duration-300"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-200/60 shrink-0">
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <span className="font-bold text-slate-900 tracking-tight whitespace-nowrap">Validator</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        
        {/* Main Nav */}
        <div className="space-y-1">
          <NavItem icon={<Home size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isCollapsed={isCollapsed} />
          <NavItem icon={<Compass size={18} />} label="Explore" active={activeTab === 'Explore'} onClick={() => setActiveTab('Explore')} isCollapsed={isCollapsed} />
          <NavItem icon={<BarChart2 size={18} />} label="Insights" active={activeTab === 'Insights'} onClick={() => setActiveTab('Insights')} isCollapsed={isCollapsed} />
        </div>

        {/* Categories section */}
        <div className="pt-2">
          {!isCollapsed && <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</p>}
          <div className="space-y-0.5">
            <button 
              onClick={() => setCategoryFilter('All')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === 'All' ? 'bg-white text-slate-900 shadow-sm font-medium border border-slate-200/50' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
              title={isCollapsed ? "All Categories" : ""}
            >
              <Folder size={16} className={categoryFilter === 'All' ? 'text-blue-500' : 'text-slate-400'} />
              {!isCollapsed && <span className="truncate">All Categories</span>}
            </button>
            {CATEGORIES.map(category => (
              <button 
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === category ? 'bg-white text-slate-900 shadow-sm font-medium border border-slate-200/50' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
                title={isCollapsed ? category : ""}
              >
                <Hash size={16} className={categoryFilter === category ? 'text-blue-500' : 'text-slate-400'} />
                {!isCollapsed && <span className="truncate">{category}</span>}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="p-3 border-t border-slate-200/60 mt-auto shrink-0">
         <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isCollapsed={isCollapsed} />
      </div>
    </motion.aside>
  );
}

function NavItem({ icon, label, active, onClick, isCollapsed }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-slate-200/70 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
      title={isCollapsed ? label : ""}
    >
      {icon}
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
