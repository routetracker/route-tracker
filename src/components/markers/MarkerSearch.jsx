import React, { useState } from 'react';

const MarkerSearch = ({ markers, onSearchResult }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (query) => {
    const filteredMarkers = markers.filter((marker) => {
      const { markerName, position } = marker;
      const { lat, lng } = position;

      const queryLowerCase = query.toLowerCase();

      return (
        queryLowerCase === '' ||
        ['markerName', 'lat', 'lng'].some(
          (key) =>
            marker[key] &&
            marker[key].toString().toLowerCase().includes(queryLowerCase)
        )
      );
    });

    onSearchResult(filteredMarkers);
  };

  
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className='search-box'>
      <input
        className='search-input'
        type="text"
        placeholder="Search markers..."
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default MarkerSearch;


