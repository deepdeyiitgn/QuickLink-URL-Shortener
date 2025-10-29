import React, { useState } from 'react';
import { ExternalLink, Eye } from 'lucide-react';

interface Url {
  id: string;
  alias: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  expiresAt?: string | null;
}

interface HistoryTableProps {
  urls: Url[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ urls }) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">History</h2>
      <p className="text-center mb-4 text-gray-300">Total links: {urls.length}</p>

      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="min-w-full bg-[#0f172a] text-white border border-gray-700">
          <thead>
            <tr className="bg-[#1e293b] text-gray-300">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Alias</th>
              <th className="py-3 px-4 text-left">Short URL</th>
              <th className="py-3 px-4 text-left">Original URL</th>
              <th className="py-3 px-4 text-left">Created</th>
              <th className="py-3 px-4 text-left">Expires</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr key={url.id} className="hover:bg-[#1e293b] transition">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{url.alias}</td>

                {/* Short URL clickable */}
                <td className="py-3 px-4 text-blue-400 underline cursor-pointer">
                  <a href={url.shortUrl} target="_self" rel="noopener noreferrer">
                    {url.shortUrl}
                  </a>
                </td>

                {/* Long URL truncate + popup on click */}
                <td
                  className="py-3 px-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-gray-300"
                  title="Click to view full URL"
                  onClick={() => setSelectedUrl(url.longUrl)}
                >
                  {url.longUrl}
                </td>

                <td className="py-3 px-4">
                  {new Date(url.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {url.expiresAt
                    ? new Date(url.expiresAt).toLocaleDateString()
                    : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedUrl(null)}
        >
          <div
            className="bg-[#0f172a] text-white p-6 rounded-xl shadow-lg max-w-[90%] md:max-w-[600px] break-words"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl mb-2">Full URL</h3>
            <p className="text-gray-300 break-all">{selectedUrl}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              onClick={() => setSelectedUrl(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
