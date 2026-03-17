import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ChevronUp } from 'lucide-react';

const getMarketStyle = (market) => {
  switch(market) {
    case 'Low': return { accent: 'bg-cyan-500/10 text-cyan-700', border: 'border-cyan-200/50', glow: 'rgba(6, 182, 212, 0.15)' };
    case 'Medium': return { accent: 'bg-purple-500/10 text-purple-700', border: 'border-purple-200/50', glow: 'rgba(168, 85, 247, 0.15)' };
    case 'High': return { accent: 'bg-orange-500/10 text-orange-700', border: 'border-orange-200/50', glow: 'rgba(249, 115, 22, 0.15)' };
    case 'Very High': return { accent: 'bg-rose-500/10 text-rose-700', border: 'border-rose-200/50', glow: 'rgba(225, 29, 72, 0.15)' };
    default: return { accent: 'bg-slate-500/10 text-slate-700', border: 'border-slate-200/50', glow: 'rgba(100, 116, 139, 0.1)' };
  }
};

export default function IdeaNode({ idea, onUpvote, isSpotlight }) {
  const ref = useRef(null);
  const mStyle = getMarketStyle(idea.market);
  
  // Subtle magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Max movement 10px
    x.set(distanceX * 0.05);
    y.set(distanceY * 0.05);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Base scale relies on difficulty (1 = 1, 5 = 1.1)
  const baseScale = 1 + (idea.difficulty - 1) * 0.02;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isSpotlight ? 1 : 0.4, 
        scale: isSpotlight ? baseScale : 0.95,
        filter: isSpotlight ? 'blur(0px)' : 'blur(2px)',
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: 'spring' }}
      className="relative w-full max-w-[320px] m-3 flex-shrink-0 cursor-pointer group z-10"
      style={{
        zIndex: isSpotlight ? 20 : 0
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: mouseX, y: mouseY }}
        whileHover={{
          y: -5,
          boxShadow: `0 20px 40px ${mStyle.glow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
        }}
        initial={{
          boxShadow: `0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)`
        }}
        className={`w-full h-full rounded-[24px] bg-white/70 backdrop-blur-2xl border ${mStyle.border} p-6 flex flex-col transition-all duration-500 overflow-hidden relative`}
      >
        {/* Soft elegant gradient mesh in the background of the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0" />
        
        <div className="relative z-10 flex justify-between items-start mb-4">
          <h3 className="font-bold text-slate-800 text-lg leading-tight pr-4">
            {idea.title}
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpvote(idea.id); }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 shadow-sm transition-all hover:shadow text-slate-600 hover:text-slate-900 flex-shrink-0 h-12 w-10"
          >
            <ChevronUp size={20} strokeWidth={3} className="-mb-1" />
            <span className="font-bold text-xs leading-none">{idea.votes}</span>
          </button>
        </div>

        <p className="relative z-10 text-sm text-slate-600 mb-6 flex-grow line-clamp-3 leading-relaxed">
          {idea.description}
        </p>

        <div className="relative z-10 mt-auto flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide">
            {idea.category}
          </span>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide border border-transparent ${mStyle.accent}`}>
            Potential: {idea.market}
          </span>
          
          <div className="ml-auto flex items-center gap-1" title={`Difficulty: ${idea.difficulty}/5`}>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i < idea.difficulty ? 'bg-slate-800' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
