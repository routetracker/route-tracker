
import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import MarkerIconPanel from './MarkerIconPanel';  


const MarkerSetter = ({ markerPosition, onMarkerChange, removeMarker, onSelectIcon, selectedIcon, defaultIcon, marker, onSelectName,  onViewMarker}) => {

    const [newMarkerName, setNewMarkerName] = useState(marker.markerName || '')


    const [options, setOptions] = useState(false);
    const markerRef = useRef(null);

    useEffect(() => {
      if (markerRef.current && markerPosition) {
        markerRef.current.setLatLng(markerPosition);
      }
    }, [markerPosition]);
  
    const dragEndHandler = () => {
      const marker = markerRef.current;
      if (marker) {
        onMarkerChange(marker.getLatLng());
      }
    };  
   
    const clickHandler = () => {
      setOptions(true)
    };
    
    const closeOptions = () => {
      setOptions(false)
    };


    const getMarkerIcon = ( selectedIcon, defaultIcon) => {
      const iconUrl = selectedIcon || defaultIcon.options.iconUrl;  

      if(iconUrl===selectedIcon){
        return new L.Icon({
          iconUrl: iconUrl,
          iconSize: [25, 41],         
          iconAnchor: [12, 41],      
        })
      }
    } 
    

    const handleSubmit = () => {
      onSelectName(newMarkerName)
    };

    const handleInputChange = (e) => {
      setNewMarkerName(e.target.value);
    };

    const popupOptions = {
      offset: [0, -20], 
    };
  
 
    return markerPosition === null ? null : (
      <Marker
        key={marker.id}
        position={markerPosition}
        draggable={true}
        eventHandlers={{
          dragend: dragEndHandler,
          click: clickHandler,
        }}
        ref={markerRef}
        icon={getMarkerIcon(selectedIcon, defaultIcon)}
      >
        <Popup className='popup' {...popupOptions}>
            <div className="icon-menu">
               {options && (
                    <MarkerIconPanel
                    onSelectIcon={onSelectIcon}
                    onOptionsClose={closeOptions} 
                    />
                )}
             </div>
             <div className="edit-box">
              <input id='edit-pop-input' type='text' 
                value={newMarkerName}
                onChange={handleInputChange}
                placeholder='Edit name'
              />
              <button id='edit-pop-btn' onClick={handleSubmit}>Submit</button>
             </div>
             <div className="marker-name"
                  style={{color: 'midnightblue'}}>
                {marker.markerName || `Marker${marker.id}`}
              </div>
             <div style={{margin: '0.4rem', color: 'midnightblue'}}>{`Latitude:  ${markerPosition.lat}`}</div>
             <div style={{margin: '0.4rem', color: 'midnightblue'}}>{`Longitude:  ${markerPosition.lng}`}</div>
             <button id='remove-btn' onClick={removeMarker}>Remove Marker</button>
        </Popup>
      </Marker>
    );
}

export default MarkerSetter

