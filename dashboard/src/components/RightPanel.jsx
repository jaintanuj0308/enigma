import { Activity, TrendingUp, Zap, Clock, Users } from 'lucide-react';

export default function RightPanel({ ideas }) {
  const total = ideas.length;
  if (total === 0) return null;

  const totalVotes = ideas.reduce((acc, curr) => acc + curr.votes, 0);

  // Group by category to build a morphing bar or rings
  const categoryCounts = ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat],
    percent: (categoryCounts[cat] / total) * 100
  })).sort((a, b) => b.count - a.count);

  const topCat = categories[0]?.name || 'Unknown';
  const topCatPercent = categories[0]?.percent || 0;

  // Average intensity (difficulty)
  const avgDiff = total > 0 ? (ideas.reduce((acc, curr) => acc + curr.difficulty, 0) / total).toFixed(1) : 0;

  // Recent activity (mocked using last 3 ideas for UI density)
  const recentIdeas = [...ideas].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  // Trending (top votes)
  const trendingIdeas = [...ideas].sort((a,b) => b.votes - a.votes).slice(0, 3);

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 border-l border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar pt-16">
      
      {/* Top Insights Section */}
      <div className="p-5 border-b border-slate-100">
         <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Ecosystem Pulse
         </h2>

         <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
               <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Total Sparks</p>
               <p className="text-2xl font-bold text-slate-900 tracking-tight">{total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
               <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Upvotes</p>
               <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalVotes}</p>
            </div>
         </div>

         {/* Distribution Bar */}
         <div className="mb-4">
            <div className="flex justify-between items-end mb-1.5">
               <span className="text-xs font-medium text-slate-600">Top Category: <strong className="text-slate-900">{topCat}</strong></span>
               <span className="text-xs text-slate-500 font-mono">{topCatPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
               {categories.map((cat, i) => {
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-400', 'bg-sky-400', 'bg-slate-300'];
                  return (
                    <div 
                      key={cat.name} 
                      className={`h-full ${colors[i % colors.length]}`} 
                      style={{ width: `${cat.percent}%` }}
                      title={`${cat.name}: ${cat.percent.toFixed(0)}%`}
                    />
                  );
               })}
            </div>
         </div>

         {/* Diff Meter */}
         <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
           <div className="flex items-center gap-2">
             <Activity size={14} className="text-red-500" />
             <span className="text-xs font-medium text-slate-700">Avg Diff Flow</span>
           </div>
           <span className="text-sm font-bold text-red-600 font-mono">{avgDiff}<span className="text-[10px] text-red-400">/5</span></span>
         </div>
      </div>

      {/* Trending Ideas */}
      <div className="p-5 border-b border-slate-100">
         <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-500" /> Rising Stars
         </h2>
         <div className="space-y-4">
            {trendingIdeas.map(idea => (
               <div key={`trend-${idea.id}`} className="group flex gap-3 items-start cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-100 transition-colors">
                     {idea.votes}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{idea.title}</h4>
                    <span className="text-[10px] font-medium text-slate-400">{idea.category}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Activity Feed */}
      <div className="p-5 flex-1">
         <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={14} className="text-blue-500" /> Recents Activity
         </h2>
         <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {recentIdeas.map(idea => (
               <div key={`recent-${idea.id}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                     <Users size={10} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-xl border border-slate-100 bg-white shadow-sm group-hover:border-slate-200 transition-colors">
                     <div className="flex items-center justify-between mb-0.5">
                       <span className="text-[10px] uppercase font-bold text-slate-400">Planted</span>
                       <span className="text-[9px] text-slate-400">New</span>
                     </div>
                     <h4 className="text-xs font-semibold text-slate-800 truncate">{idea.title}</h4>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </aside>
  );
}
