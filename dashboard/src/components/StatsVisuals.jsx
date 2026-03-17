import { motion } from 'framer-motion';

export default function StatsVisuals({ ideas }) {
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

  // Average intensity (difficulty)
  const avgDiff = ideas.reduce((acc, curr) => acc + curr.difficulty, 0) / total;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-white/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Metric 1: Total Ideas - elegant clean typography */}
      <div className="flex flex-col relative z-10 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200/50 pb-6 md:pb-0 md:pr-8">
        <p className="text-[11px] uppercase font-semibold tracking-widest text-slate-500 mb-2">Total Ideas</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight">{total}</span>
          <span className="text-sm font-medium text-slate-500">submitted</span>
        </div>
      </div>

      {/* Metric 2: Top Category - soft progress arc / percentage */}
      <div className="flex flex-col relative z-10 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200/50 pb-6 md:pb-0 px-0 md:px-8">
        <p className="text-[11px] uppercase font-semibold tracking-widest text-slate-500 mb-2">Dominant Category</p>
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-medium text-slate-800">{topCat}</span>
            <span className="text-sm font-medium text-slate-500">{categories[0]?.percent.toFixed(0)}% of total</span>
          </div>
        </div>
        
        {/* Sleek Line Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${categories[0]?.percent || 0}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
             <div className="absolute inset-0 bg-white/20 w-full h-full skeleton-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Metric 3: Ecosystem Energy (Average Difficulty & Total Votes) */}
      <div className="flex flex-col relative z-10 w-full md:w-1/3 px-0 md:pl-8">
        <p className="text-[11px] uppercase font-semibold tracking-widest text-slate-500 mb-2">Community Engagement</p>
        
        <div className="flex justify-between items-end mb-4">
           <div className="flex flex-col">
             <span className="text-3xl font-light text-slate-800">{totalVotes}</span>
             <span className="text-sm font-medium text-slate-500">Upvotes</span>
           </div>
           
           <div className="flex flex-col text-right">
             <span className="text-xl font-medium text-slate-700">{avgDiff.toFixed(1)} <span className="text-sm text-slate-400">/ 5</span></span>
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg. Diff</span>
           </div>
        </div>
      </div>
      
    </div>
  );
}
