import { motion } from 'framer-motion';
import { X, ThumbsUp, MessageSquare, Zap, Target, Bookmark, Share, Clock, Users } from 'lucide-react';

export default function IdeaDetail({ idea, onClose, onUpvote }) {
  if (!idea) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal / Sliding Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col"
      >
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 text-slate-500">
            <button className="hover:text-slate-800 transition-colors p-1" title="Bookmark">
              <Bookmark size={18} />
            </button>
            <button className="hover:text-slate-800 transition-colors p-1" title="Share">
              <Share size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onUpvote(idea.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm"
            >
              <ThumbsUp size={14} />
              Upvote <span>({idea.votes})</span>
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           
           {/* Meta labels */}
           <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">
                 {idea.category}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                 <Clock size={12} /> {new Date(idea.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}
              </span>
           </div>

           <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
             {idea.title}
           </h1>

           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Status</span>
                 <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Users size={14}/> Active</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Difficulty</span>
                 <span className="text-sm font-semibold text-slate-800 flex items-center gap-1"><Zap size={14} className="text-amber-500"/> Lvl {idea.difficulty}/5</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Market</span>
                 <span className="text-sm font-semibold text-slate-800 flex items-center gap-1"><Target size={14} className="text-purple-500"/> {idea.market}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Upvotes</span>
                 <span className="text-sm font-semibold text-slate-800 flex items-center gap-1"><ThumbsUp size={14} className="text-blue-500"/> {idea.votes} Votes</span>
              </div>
           </div>

           <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Core Problem</h3>
              <div className="bg-red-50/50 border-l-4 border-red-400 p-5 rounded-r-xl">
                 <p className="text-slate-700 leading-relaxed font-medium">
                   {idea.problem}
                 </p>
              </div>
           </section>

           <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Proposed Solution (Description)</h3>
              <p className="text-slate-600 leading-relaxed">
                {idea.description}
              </p>
           </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto flex gap-3">
           <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-colors flex items-center justify-center gap-2">
             <MessageSquare size={16} /> Discuss Idea
           </button>
           <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm font-semibold transition-colors">
             More Options
           </button>
        </div>

      </motion.div>
    </div>
  );
}
