"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Download,
  Heart,
  X,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Headphones,
  Volume2,
  AlertTriangle,
  Check,
} from "lucide-react";

interface Track {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  plays: number;
  downloads: number;
  description: string;
  coverImage: string;
  audioSrc: string;
  createdAt?: string;
  artworkCredit?: string;
  artistBio?: string;
}

interface SongDetailCardProps {
  initialTrack: Track;
}

export default function SongDetailCard({ initialTrack }: SongDetailCardProps) {
  const router = useRouter();
  const [track, setTrack] = useState<Track>(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    title: track.title || "",
    artist: track.artist || "",
    genre: track.genre || "",
    description: track.description || "",
    duration: track.duration || "",
    artworkCredit: track.artworkCredit || "",
    artistBio: track.artistBio || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [track.audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current || !track?.audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDurationSec(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const res = await fetch(`/api/tracks?id=${trackId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        router.refresh();
        router.push("/admin");
      } else {
        alert("Failed to delete track: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <>
      {/* HTML5 Audio Element with explicit source children to resolve NotSupportedError */}
      {track?.audioSrc && (
        <audio
          ref={audioRef}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={track.audioSrc} type="audio/mpeg" />
          <source src={track.audioSrc} type="audio/mp4" />
          <source src={track.audioSrc} type="audio/wav" />
        </audio>
      )}

      {/* Perfectly proportioned, flush card container matching workspace bounds */}
      <div className="w-full max-w-5xl mx-auto bg-[#120c1a]/95 border border-purple-900/30 rounded-2xl p-4 md:p-5 shadow-2xl shadow-purple-950/50 backdrop-blur-xl flex flex-col justify-between max-h-[84vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-purple-900/20 shrink-0">
          <h1 className="text-xs font-extrabold text-white tracking-wider uppercase">
            Song Details Dashboard
          </h1>
          <button
            onClick={() => router.push("/")}
            className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center py-3 overflow-y-auto">
          {/* Left Column: Artwork with Play Button Overlay */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group w-36 sm:w-44 lg:w-52 aspect-square rounded-2xl overflow-hidden border border-purple-500/30 shadow-xl bg-zinc-900">
              <img
                src={
                  track.coverImage ||
                  "https://res.cloudinary.com/demo/image/upload/sample.jpg"
                }
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-purple-400/50 flex items-center justify-center text-white hover:scale-110 hover:bg-purple-600/80 transition-all shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current text-white" />
                ) : (
                  <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
                )}
              </button>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 mt-1.5">
              Cover Art • 1000×1000
            </span>
          </div>

          {/* Right Column: Song Metadata */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-0.5">
                  {track.title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[9px] font-bold text-white flex items-center justify-center uppercase">
                    {track.artist?.substring(0, 2) || "CL"}
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">
                    {track.artist}
                  </span>
                  <span className="text-blue-400 text-[10px] font-bold">✓</span>
                </div>
              </div>

              <span className="self-start sm:self-auto text-[10px] font-semibold px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full shadow">
                {track.genre || "Amapiano"}
              </span>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Published:{" "}
                {track.createdAt
                  ? new Date(track.createdAt).toLocaleDateString()
                  : "12 June 2024"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {track.duration || "3:42"}
              </span>
              <span className="flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-purple-400" />
                {track.plays || 0} plays
              </span>
            </div>

            {/* Description & Bio Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-zinc-300 pt-1 border-t border-purple-900/20">
              <div>
                <h3 className="font-bold text-white mb-0.5 uppercase tracking-wider text-[9px] text-purple-400">
                  Description
                </h3>
                <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                  {track.description ||
                    "A smooth track inspired by night lights, blending atmospheric pads and rich log drums."}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-0.5 uppercase tracking-wider text-[9px] text-purple-400">
                  Artist Bio
                </h3>
                <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                  {track.artistBio ||
                    `${track.artist} is a producer blending Amapiano with ambient nightwave, known for atmospheric soundscapes.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Media Controls, Waveform & Action Buttons */}
        <div className="pt-2.5 border-t border-purple-900/30 space-y-2.5 shrink-0">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(durationSec) || track.duration}</span>
            </div>
            <input
              type="range"
              min={0}
              max={durationSec || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full border border-purple-500/80 bg-purple-950/60 hover:bg-purple-600 text-white flex items-center justify-center transition-all shadow shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>

              <a
                href={track.audioSrc}
                download
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-all shadow"
                title="Download Track"
              >
                <Download className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 border rounded-xl transition-all shadow ${
                  isLiked
                    ? "bg-pink-950/40 border-pink-500/40 text-pink-400"
                    : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-pink-500" : ""}`}
                />
              </button>
            </div>

            {/* Waveform Visualizer */}
            <div className="flex-1 w-full max-w-xs hidden md:flex items-center gap-1 h-6 px-2 overflow-hidden bg-black/30 rounded-xl border border-zinc-900">
              {[
                40, 65, 30, 85, 95, 45, 60, 75, 100, 80, 50, 65, 90, 40, 70, 85,
                95, 60,
              ].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-t from-purple-600 to-pink-500 animate-pulse"
                      : "bg-zinc-800"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-purple-500/40 bg-zinc-900/80 hover:bg-purple-950/50 text-purple-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow"
              >
                <Pencil className="w-3 h-3" />
                Edit Song
              </button>

              <button
                onClick={() => setIsDeleteOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow"
              >
                <Trash2 className="w-3 h-3" />
                Delete Song
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161022] border border-purple-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Edit Song Details
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={editForm.artist}
                  onChange={(e) =>
                    setEditForm({ ...editForm, artist: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={editForm.genre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, genre: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm({ ...editForm, duration: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161022] border border-rose-500/30 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold text-white mb-1">Delete Song?</h2>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Hey, this action is irreversible. Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                &quot;{track.title}&quot;
              </span>
              ?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTrack(track._id)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
