"use client";
import { Search, Bell, ChevronDown, Upload } from "lucide-react";

interface HeaderProps {
  onOpenUpload: () => void;
}

export default function Header({ onOpenUpload }: HeaderProps) {
  return (
    <header className="h-20 bg-zinc-950/80 border-b border-zinc-800/60 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Bar */}
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search songs, artists, events..."
          className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-xl pl-11 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
        />
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-5">
        {/* Upload Song Primary Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer"
        >
          <Upload className="w-4 h-4 rotate-180" />
          <span>Upload Song</span>
        </button>

        <div className="h-5 w-[1px] bg-zinc-800" />

        {/* Notifications */}
        <button className="relative p-2.5 text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/60 rounded-xl transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
        </button>

        {/* Admin Profile Dropdown */}
        <div className="flex items-center gap-3 pl-2 py-1.5 px-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            C
          </div>
          <span className="text-xs font-semibold text-white">
            City Lights Admin
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400 ml-1" />
        </div>
      </div>
    </header>
  );
}
