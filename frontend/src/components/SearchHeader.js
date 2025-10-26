import React, { useState } from 'react';

const SearchHeader = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-blue-600 p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Find Your Dream Job</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 rounded text-black"
        />
        <button type="submit" className="bg-white text-blue-600 px-4 py-2 rounded">Search</button>
      </form>
    </div>
  );
};

export default SearchHeader;
