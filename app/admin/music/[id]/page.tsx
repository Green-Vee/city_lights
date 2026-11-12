"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/SideBar";
import Header from "../../components/Header";
import Link from "next/link";
import SongDetailCard from "../../components/SongDetailCard";

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

function TrackDetailContent() {
  const params = useParams();
  const id = params?.id;

  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTrackDetails() {
      try {
        const response = await fetch(`/api/tracks/${id}`);
        const result = await response.json();
        if (result.success && result.data) {
          setTrack(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch track details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrackDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
        <p className="text-xs tracking-widest uppercase animate-pulse text-purple-400">
          Loading Song Experience...
        </p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-xl font-bold text-white mb-2">Track Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6">
          The song you are looking for might have been removed or doesn&apos;t
          exist.
        </p>
        <Link
          href="/"
          className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0914] text-zinc-100 flex font-sans selection:bg-purple-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenUpload={() => {}} />

        <main className="flex-1 p-6 md:p-8 flex flex-col justify-center max-w-7xl mx-auto w-full overflow-y-auto">
          <SongDetailCard initialTrack={track} />
        </main>
      </div>
    </div>
  );
}

export default function TrackDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
          <p className="text-xs tracking-widest uppercase animate-pulse text-purple-400">
            Loading Song Experience...
          </p>
        </div>
      }
    >
      <TrackDetailContent />
    </Suspense>
  );
}
