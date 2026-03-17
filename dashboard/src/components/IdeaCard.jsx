import { motion } from 'framer-motion';
import { ThumbsUp, Tag, Target, Zap } from 'lucide-react';

export default function IdeaCard({ idea, onUpvote }) {
  const getDifficultyColor = (score) => {
    switch(score) {
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 4: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
      case 5: return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getMarketColor = (level) => {
    switch(level) {
      case 'Low': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'High': return 'text-blue-500';
      case 'Very High': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border shadow-sm rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col h-full transform hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold pr-2 leading-tight group-hover:text-primary transition-colors">
          {idea.title}
        </h3>
        
        <button 
          onClick={() => onUpvote(idea.id)}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-accent hover:bg-primary/10 text-accent-foreground hover:text-primary transition-colors flex-shrink-0 min-w-12 h-14"
        >
          <ThumbsUp size={18} className="mb-0.5" />
          <span className="font-bold text-sm leading-none">{idea.votes}</span>
        </button>
      </div>
      
      <p className="text-foreground/80 mb-5 flex-grow line-clamp-3 leading-relaxed">
        {idea.description}
      </p>

      <div className="mt-auto space-y-4">
        {idea.problem && (
          <div className="bg-muted p-3 rounded-xl border-l-4 border-primary">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Problem Statement</h4>
            <p className="text-sm italic text-foreground/80">{idea.problem}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 text-sm pt-4 border-t border-border">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
            <Tag size={14} /> {idea.category}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${getDifficultyColor(idea.difficulty)}`}>
            <Zap size={14} /> Diff: {idea.difficulty}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted font-medium`}>
            <Target size={14} className={getMarketColor(idea.market)}/> Market: {idea.market}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
