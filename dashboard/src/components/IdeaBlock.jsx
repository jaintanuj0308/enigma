import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Zap, Target, Bookmark, Share } from 'lucide-react';

const getDifficultyLabel = (diff) => {
  switch(diff) {
    case 1: return { label: 'L1 - Dust', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    case 2: return { label: 'L2 - Pebble', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 3: return { label: 'L3 - Rock', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 4: return { label: 'L4 - Boulder', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 5: return { label: 'L5 - Mountain', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    default: return { label: 'Unknown', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
};

const getMarketColor = (market) => {
  switch(market) {
    case 'Low': return 'bg-cyan-100 text-cyan-800';
    case 'Medium': return 'bg-purple-100 text-purple-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Very High': return 'bg-rose-100 text-rose-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

export default function IdeaBlock({ idea, onUpvote, isSpotlight }) {
  const dStyle = getDifficultyLabel(idea.difficulty);
  const mColor = getMarketColor(idea.market);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isSpotlight ? 1 : 0.3, 
        scale: isSpotlight ? 1 : 0.98,
        filter: isSpotlight ? 'blur(0px)' : 'blur(1px)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-pointer relative overflow-hidden ${!isSpotlight && 'pointer-events-none'}`}
    >
      
      {/* Header Area */}
      <div className="flex justify-between items-start mb-3 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
             <span className="px-2 py-0.5 rounded border border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-md">
               {idea.category}
             </span>
             <span className="text-[10px] text-slate-400 font-medium">#{idea.id.substring(0,6)}</span>
             <span className="text-[10px] text-slate-400 font-medium ml-auto block sm:hidden">
               {new Date(idea.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
             </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
            {idea.title}
          </h3>
        </div>

        {/* Upvote Block */}
        <button 
          onClick={(e) => { e.stopPropagation(); onUpvote(idea.id); }}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-sm text-slate-600 hover:text-blue-600 transition-all shrink-0 w-12 group-hover:bg-blue-50/50"
        >
          <ThumbsUp size={16} strokeWidth={2.5} className="mb-0.5" />
          <span className="font-bold text-xs leading-none">{idea.votes}</span>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
        {idea.description}
      </p>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-slate-100">
         <div className={`px-2 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 ${dStyle.color}`}>
           <Zap size={12} strokeWidth={2.5} />
           {dStyle.label}
         </div>
         
         <div className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${mColor}`}>
           <Target size={12} strokeWidth={2.5} />
           M: {idea.market}
         </div>

         <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors tooltip" title="Bookmark">
              <Bookmark size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors tooltip" title="Comments">
              <MessageSquare size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors tooltip" title="Share">
              <Share size={14} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
