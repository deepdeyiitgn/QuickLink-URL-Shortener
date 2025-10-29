import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface LinkData {
  _id: string;
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchLinks = async () => {
    try {
      if (!reloading) setLoading(true);
      const res = await fetch("/api/urls");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      // Sort new → old
      const sorted = data.sort(
        (a: LinkData, b: LinkData) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
      setLinks(sorted);
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

  const totalPages = Math.ceil(links.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentLinks = links.slice(startIdx, startIdx + perPage);

  const renderTimeLeft = (expiresAt?: string) => {
    if (!expiresAt) return "-";
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      if (hoveredRow) setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [hoveredRow]);

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

      {/* Loading / Error / Empty */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-2xl animate-pulse">
          <span className="inline-block animate-bounce">.</span>
          <span className="inline-block animate-bounce delay-150">.</span>
          <span className="inline-block animate-bounce delay-300">.</span>
        </div>
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
          <p className="text-gray-300 mb-3 text-sm">
            Total Active Links:{" "}
            <span className="text-brand-primary font-semibold">
              {links.length}
            </span>
          </p>

          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-800/80">
                <tr>
                  <th className="border border-gray-700 px-3 py-2 text-left">#</th>
                  <th className="border border-gray-700 px-3 py-2 text-left">
                    Short Link
                  </th>
                  <th className="border border-gray-700 px-3 py-2 text-left">
                    Alias
                  </th>
                  <th className="border border-gray-700 px-3 py-2 text-left">
                    Created
                  </th>
                  <th className="border border-gray-700 px-3 py-2 text-left">
                    Expires
                  </th>
                  <th className="border border-gray-700 px-3 py-2 text-left">
                    Time Left
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLinks.map((link, i) => {
                  const expired =
                    link.expiresAt && new Date(link.expiresAt).getTime() < now;
                  return (
                    <tr
                      key={link._id}
                      className={`transition ${
                        expired
                          ? "bg-gray-800/40 line-through text-gray-500 cursor-not-allowed"
                          : "hover:bg-gray-800/60"
                      }`}
                      onMouseEnter={() => setHoveredRow(link._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="border border-gray-700 px-3 py-2">
                        {startIdx + i + 1}
                      </td>
                      <td className="border border-gray-700 px-3 py-2 text-blue-400">
                        {expired ? (
                          <span>{link.shortUrl}</span>
                        ) : (
                          <a
                            href={link.shortUrl}
                            className="hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = link.shortUrl;
                            }}
                          >
                            {link.shortUrl}
                          </a>
                        )}
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
                      <td className="border border-gray-700 px-3 py-2">
                        {hoveredRow === link._id
                          ? renderTimeLeft(link.expiresAt)
                          : link.expiresAt
                          ? "-"
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-300">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-800 rounded-md disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-800 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryTable;

