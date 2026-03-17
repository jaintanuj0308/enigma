import { BarChart3, Activity, PieChart, Layers } from 'lucide-react';

export default function StatsPanel({ ideas }) {
  const totalIdeas = ideas.length;
  
  // Calculate average difficulty
  const avgDifficulty = totalIdeas > 0 
    ? (ideas.reduce((acc, curr) => acc + curr.difficulty, 0) / totalIdeas).toFixed(1)
    : 0;

  // Calculate most common category
  const getMostCommonCategory = () => {
    if (totalIdeas === 0) return 'N/A';
    
    const counts = ideas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };
  
  // Calculate total upvotes
  const totalVotes = ideas.reduce((acc, curr) => acc + curr.votes, 0);

  const statCards = [
    {
      label: "Total Ideas",
      value: totalIdeas,
      icon: <Layers size={24} />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Top Category",
      value: getMostCommonCategory(),
      icon: <PieChart size={24} />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      label: "Avg. Difficulty",
      value: `${avgDifficulty} / 5`,
      icon: <Activity size={24} />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      label: "Total Engagement",
      value: `${totalVotes} Votes`,
      icon: <BarChart3 size={24} />,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <div 
          key={i} 
          className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4 hover:border-border transition-colors shadow-sm hover:shadow"
        >
          <div className={`p-3 rounded-xl flex-shrink-0 ${stat.bgColor} ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <h4 className="text-xl sm:text-2xl font-bold leading-none">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
