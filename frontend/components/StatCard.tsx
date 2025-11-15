import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  return (
    <div className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-black hover:shadow-black-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

