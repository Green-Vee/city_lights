"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import RecentUploadsTable from "./components/RecentUploadsTable";
import UploadModal from "./components/UploadModal";
import { Music, Play, Users, Headphones } from "lucide-react";

const metricsData = [
  { title: "Total Songs", value: "24", icon: Music },
  { title: "Total Plays", value: "128K", icon: Play },
  { title: "Total Artists", value: "6", icon: Users },
  { title: "Monthly Listeners", value: "12.4K", icon: Headphones },
];

export default function AdminPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  // Fetch live tracks from /api/tracks
  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/tracks");
      const result = await response.json();
      if (result.success) {
        setTracks(result.data);
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
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">
              Dashboard
            </h1>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
              />
            ))}
          </div>

          {/* Recent Uploads Table Section (passing real tracks and refetch function) */}
          <RecentUploadsTable tracks={tracks} loading={loadingTracks} />
        </main>
      </div>

      {/* Upload Modal Component */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          fetchTracks(); // Refreshes tracks from /api/tracks as soon as modal closes/uploads
        }}
      />
    </div>
  );
}
