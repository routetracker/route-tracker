import React, {useState, useEffect} from 'react'
import MarkerSearch from './MarkerSearch';
import arrowRight from '../../assets/arrow-right-solid.svg'


const MarkersPanel = ({ markers, onViewMarker, onClearMarkers, setIsOverMarkerPanel, updateMarkerName, onRemoveMarker, onClosePanel}) => {
  const [editingMarkerId, setEditingMarkerId] = useState(null);
  const [searchResults, setSearchResults] = useState(markers);



  const handleMarkerClick = (position) => {
    onViewMarker(position);
  };

  const handleClearAll = ()=>{
    onClearMarkers()
  }


  const handleEnter = () => {
    setIsOverMarkerPanel(true);
  };

  const handleLeave = () => {
    setIsOverMarkerPanel(false);
  };

  const handleInputChange = (e, markerId) => {   
    updateMarkerName(markerId, e.target.value);
  };

  const handleRemoveMarker = (markerId) => {
    console.log('Removing marker with ID:', markerId);
    onRemoveMarker(markerId)
  }

  const handleSearchResult = (result) => {
    setSearchResults(result);
  };


  useEffect(() => {
    setSearchResults(markers);
  }, [markers]);

  const handleClosePanel = () => {
    onClosePanel(false)
  }


  
  return (
    <>
    <div className="panel-header">
      <button className="close-panel" 
        onClick={handleClosePanel}>
        <img id="panel-arrow" src={arrowRight} alt="" />
      </button>
      <h2 className='panel-title'>Marker Panel</h2>
    </div>
      <MarkerSearch markers={markers} onSearchResult={handleSearchResult} />
      <div className="marker-list" 
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}>
          {searchResults.map((marker, index) => (
          <div key={index} className="marker-item" onClick={() => handleMarkerClick(marker.position)}>
            <img src={marker.icon} alt={`Marker ${index + 1}`} style={{width: `25px`, height: `41px`}}/>
            {editingMarkerId === marker.id ? (
              <input
                type="text"
                value={marker.markerName}
                onChange={(e) => handleInputChange(e, marker.id)}
                onBlur={() => setEditingMarkerId(null)} 
              />
            ) : (
              <p>{marker.markerName === ""? `Marker ${marker.id}`: `${marker.markerName}`}</p>
            )}
            <p style={{fontWeight: '600'}}>Latitude:</p>
            <p>{marker.position.lat}</p>
            <p style={{fontWeight: '600'}}>Longitude: </p>
            <p>{marker.position.lng}</p>
            <div className="markers-btn-box">
              <button className='markers-panel-button'
                onClick={() => {
                  setEditingMarkerId(marker.id)
                }}
              >
                Edit Marker
              </button>
              <button className='markers-panel-button'
                onClick={() => {
                  handleRemoveMarker(marker.id)
                }}
                >
                Remove Marker
              </button>
            </div>
          </div>
          ))}
        {/* ))} */}
                  
        <button
          onClick={() => {
            handleClearAll()
          }}
          style={{ position: "absolute", bottom: 4, right: 10, zIndex: 1000 }}
        >
          Clear All Markers
        </button>
      </div>
    </>
  );
};

export default MarkersPanel