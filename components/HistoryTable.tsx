import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react"; // icon for reload button

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-wide">
          QuickLink History
        </h1>
        <button
          onClick={handleReload}
          disabled={reloading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${reloading ? "animate-spin" : ""}`} />
          {reloading ? "Refreshing..." : "Reload"}
        </button>
      </div>

      {/* Status or error */}
      {loading ? (
        <p className="text-center text-gray-400 animate-pulse mt-10">
          Fetching your link history...
        </p>
      ) : error ? (
        <p className="text-center text-red-400 mt-10">
          Error: {error}. Please reload.
        </p>
      ) : links.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No links found. Try shortening one first.
        </p>
      ) : (
        <>
          {/* Total Count */}
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
                  <tr
                    key={link._id}
                    className="hover:bg-gray-800/60 transition"
                  >
                    <td className="border border-gray-700 px-3 py-2">{i + 1}</td>
                    <td className="border border-gray-700 px-3 py-2 break-all">
                      {link.originalUrl}
                    </td>
                    <td className="border border-gray-700 px-3 py-2 text-blue-400">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {link.shortUrl}
                      </a>
                    </td>
                    <td className="border border-gray-700 px-3 py-2">{link.alias || "-"}</td>
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
    </div>
  );
};

export default HistoryTable;
