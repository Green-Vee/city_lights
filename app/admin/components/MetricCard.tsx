import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="relative group overflow-hidden bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/80 hover:border-purple-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 backdrop-blur-md transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-purple-950/30">
      {/* Background ambient glow effect */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-zinc-950 to-zinc-900 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
      </div>
      <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
        {title}
      </span>
      <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
        {value}
      </h2>
    </div>
  );
}
