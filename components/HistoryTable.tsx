import React, { useEffect, useState } from "react";
import { RefreshCw, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingIcon } from "@/components/ui/loading-icon"; // adjust import path if needed

interface LinkData {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  createdAt?: string;
  expiresAt?: string;
}

const HistoryTable: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchLinks = async () => {
    try {
      if (!reloading) setLoading(true);
      const res = await fetch("/api/urls");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setReloading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleReload = () => {
    setReloading(true);
    fetchLinks();
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <LoadingIcon className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-wide">QuickLink History</h1>
        <button
          onClick={handleReload}
          disabled={reloading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${reloading ? "animate-spin" : ""}`} />
          {reloading ? "Refreshing..." : "Reload"}
        </button>
      </div>

      {/* Error / Empty */}
      {error ? (
        <p className="text-center text-red-400 mt-10">Error: {error}</p>
      ) : links.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No links found. Try shortening one first.
        </p>
      ) : (
        <>
          {/* Count */}
          <p className="text-gray-300 mb-3 text-sm">
            Total Active Links:{" "}
            <span className="text-brand-primary font-semibold">
              {links.length}
            </span>
          </p>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-800/80">
                <tr>
                  <th className="border border-gray-700 px-3 py-2 text-left">#</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">Original Link</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">Short Link</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">Alias</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">Created</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">Expires</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr key={link._id} className="hover:bg-gray-800/60 transition">
                    <td className="border border-gray-700 px-3 py-2">{i + 1}</td>

                    {/* Original URL (truncated + popup) */}
                    <td
                      className="border border-gray-700 px-3 py-2 max-w-[250px] truncate cursor-pointer"
                      onClick={() => setSelectedUrl(link.originalUrl)}
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </td>

                    {/* Short URL (SPA navigation) */}
                    <td
                      className="border border-gray-700 px-3 py-2 text-blue-400 cursor-pointer hover:underline"
                      onClick={() => navigate(`/${link.alias || link._id}`)}
                    >
                      {link.shortUrl}
                    </td>

                    <td className="border border-gray-700 px-3 py-2">
                      {link.alias || "-"}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {link.createdAt
                        ? new Date(link.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {link.expiresAt
                        ? new Date(link.expiresAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Popup for full original URL */}
      {selectedUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-[90%]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Full Original URL</h2>
              <button onClick={() => setSelectedUrl(null)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <p className="text-gray-200 break-all">{selectedUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
