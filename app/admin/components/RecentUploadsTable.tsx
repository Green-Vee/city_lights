interface TrackItem {
  _id?: string;
  id?: string;
  title: string;
  artist: string;
  plays: number | string;
  status: "Published" | "Draft";
}

interface RecentUploadsTableProps {
  tracks?: TrackItem[];
  loading?: boolean;
}

export default function RecentUploadsTable({
  tracks = [],
  loading = false,
}: RecentUploadsTableProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900/95 via-zinc-950/90 to-zinc-950/95 border border-purple-500/20 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl">
      {/* Ambient background glow inside table container */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-7 py-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-wide">
            Recent Uploads
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Latest tracks added to the catalog
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-950/80">
              <th className="py-4 px-7">Song Title</th>
              <th className="py-4 px-7">Artist</th>
              <th className="py-4 px-7">Plays</th>
              <th className="py-4 px-7">Status</th>
              <th className="py-4 px-7">Published Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40 text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-zinc-500 text-xs"
                >
                  Loading catalog data...
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-zinc-500 text-xs"
                >
                  No tracks found in the database yet. Click &quot;Upload
                  Song&quot; to add one!
                </td>
              </tr>
            ) : (
              tracks.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="hover:bg-gradient-to-r hover:from-purple-950/20 hover:via-pink-950/10 hover:to-transparent transition-all duration-200 group"
                >
                  <td className="py-4.5 px-7 font-semibold text-white group-hover:text-pink-400 transition-colors">
                    {item.title}
                  </td>
                  <td className="py-4.5 px-7 text-zinc-300 font-medium">
                    {item.artist}
                  </td>
                  <td className="py-4.5 px-7 text-zinc-300 font-mono tracking-wide">
                    {item.plays}
                  </td>
                  <td className="py-4.5 px-7">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-inner ${
                        item.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/40"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/40"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${item.status === "Published" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
                      />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
