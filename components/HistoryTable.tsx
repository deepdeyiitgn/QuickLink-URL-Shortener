import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadingIcon } from "./icons/IconComponents";

interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string;
}

interface HistoryTableProps {
  urls: UrlData[];
  loading: boolean;
}

export default function HistoryTable({ urls, loading }: HistoryTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const urlsPerPage = 10;
  const totalPages = Math.ceil(urls.length / urlsPerPage);
  const indexOfLast = currentPage * urlsPerPage;
  const indexOfFirst = indexOfLast - urlsPerPage;
  const currentUrls = urls.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    if (!hoveredId) return;

    const interval = setInterval(() => {
      const hoveredUrl = urls.find((url) => url.id === hoveredId);
      if (!hoveredUrl) return;

      const expiry = new Date(hoveredUrl.expiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft((prev) => ({ ...prev, [hoveredId]: "Expired" }));
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft((prev) => ({
          ...prev,
          [hoveredId]: `${hours}h ${minutes}m ${seconds}s`,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hoveredId, urls]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <LoadingIcon className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No URLs shortened yet.
      </div>
    );
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm sm:text-base">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Short URL</th>
            {!isMobile && <th className="p-2 border">Original URL</th>}
            {!isMobile && <th className="p-2 border">Created</th>}
            <th className="p-2 border">Expires</th>
            {!isMobile && <th className="p-2 border">Time Left</th>}
          </tr>
        </thead>
        <tbody>
          {currentUrls.map((url, index) => {
            const expired = new Date(url.expiresAt) < new Date();
            const timeText = expired
              ? "Expired"
              : hoveredId === url.id
              ? timeLeft[url.id] || "Calculating..."
              : "";

            return (
              <tr
                key={url.id}
                onMouseEnter={() => setHoveredId(url.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`text-center text-sm sm:text-base transition-colors ${
                  expired
                    ? "text-gray-400 line-through bg-gray-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <td className="border p-2">{indexOfFirst + index + 1}</td>
                <td className="border p-2">
                  {expired ? (
                    <span>{url.shortUrl}</span>
                  ) : (
                    <Link
                      to={url.shortUrl}
                      target="_self"
                      className="text-blue-600 hover:underline"
                    >
                      {url.shortUrl}
                    </Link>
                  )}
                </td>
                {!isMobile && (
                  <td className="border p-2 truncate max-w-[200px]">
                    {url.originalUrl}
                  </td>
                )}
                {!isMobile && (
                  <td className="border p-2">
                    {new Date(url.createdAt).toLocaleString()}
                  </td>
                )}
                <td className="border p-2">
                  {new Date(url.expiresAt).toLocaleString()}
                </td>
                {!isMobile && (
                  <td className="border p-2 text-gray-600">{timeText}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4 text-sm sm:text-base">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md border ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          ⬅ Prev
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md border ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
