"use client";

import { useState } from "react";
import { X, UploadCloud, Image as ImageIcon, Calendar } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gather raw form values straight from the inputs
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/tracks", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        onClose(); // Instantly close modal and return to main dashboard view
      } else {
        alert("Upload Failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during file upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl max-h-[85vh] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-zinc-950 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/50 flex flex-col text-zinc-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80 shrink-0">
          <h2 className="text-lg font-extrabold text-white tracking-wide">
            Upload New Song
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Left Column: Native File Upload Inputs */}
            <div className="flex flex-col justify-between gap-3.5 h-full">
              {/* Audio Dropzone Input */}
              <label className="flex-1 min-h-[145px] border-2 border-dashed border-purple-500/40 bg-purple-950/10 hover:bg-purple-950/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all">
                <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                  <UploadCloud className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs font-semibold text-white tracking-wide">
                  Select Audio File (MP3 / WAV)
                </p>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  required
                  className="mt-2 text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-purple-900/50 file:text-purple-300 file:cursor-pointer"
                />
              </label>

              {/* Cover Art Dropzone Input */}
              <label className="flex-1 min-h-[145px] border-2 border-dashed border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all">
                <div className="w-11 h-11 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs font-semibold text-zinc-200">
                  Select Cover Art (JPG / PNG)
                </p>
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  className="mt-2 text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-zinc-800 file:text-zinc-300 file:cursor-pointer"
                />
              </label>
            </div>

            {/* Right Column: Hardcore Text Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter song title"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Artist Name
                </label>
                <input
                  type="text"
                  name="artist"
                  placeholder="Enter artist name"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Genre
                </label>
                <select
                  name="genre"
                  defaultValue="Afrobeat"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/60"
                >
                  <option value="Afrobeat">Afrobeat</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="R&B">R&B</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Add description..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-1.5 text-xs text-zinc-200 resize-none focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md disabled:opacity-50"
          >
            {loading ? "Uploading File..." : "Publish Song"}
          </button>
        </div>
      </form>
    </div>
  );
}