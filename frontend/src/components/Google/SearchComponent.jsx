import React, { useState } from "react";
import Header from "../../priyanka/components/Header";
import Footer from "../../priyanka/components/Footer";
// React Icons
const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`http://localhost:8383/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
<Header />
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-xl mt-20 flex">
        <input
          type="text"
          placeholder="Search Google..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="mt-6 text-gray-500">Searching...</p>}

      {/* Results */}
      <div className="mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="mb-4 border-b border-gray-200 pb-3">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-500">{item.link}</p>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
    <Footer />
          </div>
  );
};

export default SearchComponent;
