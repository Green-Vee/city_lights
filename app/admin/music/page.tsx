"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import { Plus, Search, Filter, Play } from "lucide-react";

interface SongItem {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  plays: string;
  status: "Published" | "Draft";
}

export default function MusicPage() {
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [tracks, setTracks] = useState<SongItem[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  // Fetch live tracks from /api/tracks
  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/tracks");
      const result = await response.json();
      console.log("Fetched tracks from database:", result);

      if (result.success) {
        setTracks(result.data);
        console.log("Fetched tracks from database:", result.data);
      }
    } catch (error) {
      console.error("Failed to fetch tracks from database:", error);
    } finally {
      setLoadingTracks(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="p-8 flex-1 bg-zinc-950/40 space-y-8 overflow-y-auto">
          {/* Page Title & Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                My Music Catalog
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage, organize, and monitor all audio tracks across the
                platform. Click any track to view details.
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-pink-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Track</span>
            </button>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl pl-11 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Filter Status</span>
              </button>
            </div>
          </div>

          {/* Music Table Container */}
          <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900/95 via-zinc-950/90 to-zinc-950/95 border border-purple-500/20 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl">
            <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-950/80">
                    <th className="py-4 px-7">Title</th>
                    <th className="py-4 px-7">Artist</th>
                    <th className="py-4 px-7">Album</th>
                    <th className="py-4 px-7">Duration</th>
                    <th className="py-4 px-7">Plays</th>
                    <th className="py-4 px-7">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-sm">
                  {tracks.map((song) => (
                    <tr
                      key={song._id}
                      onClick={() => {
                        router.push(`/admin/music/${song._id}`);
                        console.log(
                          `Navigating to track details for ID: ${song._id}`,
                        );
                      }}
                      className="hover:bg-gradient-to-r hover:from-purple-950/20 hover:via-pink-950/10 hover:to-transparent transition-all duration-200 group cursor-pointer"
                    >
                      <td className="py-4.5 px-7 font-semibold text-white group-hover:text-pink-400 transition-colors flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                        <span>{song.title}</span>
                      </td>
                      <td className="py-4.5 px-7 text-zinc-300 font-medium">
                        {song.artist}
                      </td>
                      <td className="py-4.5 px-7 text-zinc-400 text-xs">
                        {song.album}
                      </td>
                      <td className="py-4.5 px-7 text-zinc-400 font-mono text-xs">
                        {song.duration}
                      </td>
                      <td className="py-4.5 px-7 text-zinc-300 font-mono tracking-wide">
                        {song.plays}
                      </td>
                      <td className="py-4.5 px-7">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-inner ${
                            song.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/40"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${song.status === "Published" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
                          />
                          {song.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
