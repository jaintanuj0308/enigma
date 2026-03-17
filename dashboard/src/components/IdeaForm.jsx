import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';

const CATEGORIES = ["SaaS", "E-commerce", "Mobile App", "AI/ML", "Fintech", "Healthtech", "Other"];
const MARKET_OPTIONS = ["Low", "Medium", "High", "Very High"];

export default function IdeaForm({ onClose, onSubmit, existingTitles }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem: '',
    category: CATEGORIES[0],
    difficulty: 1,
    market: MARKET_OPTIONS[1]
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (existingTitles.includes(formData.title.trim().toLowerCase())) {
      newErrors.title = 'An idea with this title already exists';
    }
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.problem.trim()) newErrors.problem = 'Problem statement is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        difficulty: parseInt(formData.difficulty)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/50">
          <h2 className="text-2xl font-bold">Submit Startup Idea</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="idea-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Startup Title <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 outline-none transition-all ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                placeholder="e.g. Uber for Pets"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Short Description <span className="text-red-500">*</span></label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 outline-none transition-all min-h-[100px] resize-none ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                placeholder="Briefly describe what the startup does..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-sm font-semibold mb-2">Problem Statement <span className="text-red-500">*</span></label>
              <textarea 
                value={formData.problem}
                onChange={e => setFormData({...formData, problem: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 outline-none transition-all min-h-[80px] resize-none ${errors.problem ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                placeholder="What specific problem does this solve?"
              />
              {errors.problem && <p className="text-red-500 text-sm mt-1">{errors.problem}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category <span className="text-red-500">*</span></label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
                  Difficulty
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{formData.difficulty}/5</span>
                </label>
                <div className="flex items-center gap-4 mt-4">
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Easy</span>
                  <span>Extremely Hard</span>
                </div>
              </div>

              {/* Market Potential */}
              <div>
                <label className="block text-sm font-semibold mb-2">Market Potential <span className="text-red-500">*</span></label>
                <select 
                  value={formData.market}
                  onChange={e => setFormData({...formData, market: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  {MARKET_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="idea-form"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={18} />
            Submit Idea
          </button>
        </div>
      </motion.div>
    </div>
  );
}
