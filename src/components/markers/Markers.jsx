import React, { useState, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import marker from '../../assets/marker.svg'


import MarkerSetter from './MarkerSetter';
import MarkersPanel from './MarkersPanel';

const Markers = () => {
  let defaultIcon = L.icon({
    iconUrl: marker,
    shadowUrl: iconShadow
  });

  const [isOverMarkerPanel, setIsOverMarkerPanel] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);

  const [markers, setMarkers] = useState(() => {
    const storedMarkers = JSON.parse(localStorage.getItem("markers"));
    return storedMarkers !== null ? storedMarkers : [];
  });
  
  useEffect(()=>{
    localStorage.setItem("markers", JSON.stringify(markers))
  },[markers])  
  
  const map = useMap();

  
  // className: "little-blue-dot-" + device.id
  
  const addMarker = (position, markerName) => {
    const markerObject = { id: Date.now(), position, markerName, icon: defaultIcon.options.iconUrl };

    // markerObject.getElement().classList.add('marker-clickable');

    setMarkers((prevMarkers) => [...prevMarkers, markerObject]);
  };

  const clearMarkers = () => {
    const userConfirmed = window.confirm('Are you sure you want to clear all markers?');

    if (userConfirmed) {
      setMarkers([]);
    }
  };

  const updateMarkerIcon = (markerId, newIcon) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, icon: newIcon } : marker
      )
    );
  };
 
  const updateMarkerName = (markerId, markerName) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => {
        if (marker.id === markerId) {
          return { ...marker, markerName: typeof markerName !== 'undefined' ? markerName : marker.markerName };
        } else {
          return marker;
        }
      })
    );
  };

  const setMapView = (position) => {
    map.setView(position, map.getZoom())
  };

  useMapEvents({
    dblclick: (e) => {
        const isButtonOrPanel = e.originalEvent.target.closest('.ip-box, .markers-panel, button, input, .route-box');
         if (!isButtonOrPanel) {
          addMarker(e.latlng, '');
        }
    },
  }); 

  useEffect(() => {
    if(isOverMarkerPanel){
      map.scrollWheelZoom.disable();
    }
    return () => {
      map.scrollWheelZoom.enable();
    };
  }, [map, isOverMarkerPanel]);

  const switchPanel = () => {
    setPanelOpen(!panelOpen)
    console.log("markers" + panelOpen)
  }

  return (
    <>
      {markers.map((marker) => (
        <MarkerSetter
          id={marker.id}
          key={marker.id}  
          marker={marker} 
          markerPosition={marker.position}
          selectedIcon={marker.icon}
          defaultIcon={marker}
          onMarkerChange={(position) =>
            setMarkers((prevMarkers) => [
              ...prevMarkers.map((m) => (m.id === marker.id ? { ...m, position } : m)),
            ])
          }
          removeMarker={() => setMarkers((prevMarkers) => prevMarkers.filter((m) => m.id !== marker.id))}
          onSelectIcon={(icon) => {
            updateMarkerIcon(marker.id, icon);
          }}
          onSelectName={(newMarkerName) => updateMarkerName(marker.id, newMarkerName)}
        />
      ))}
      <button className="open-panel" 
        onClick={()=>switchPanel()}>
          <img id="panel-marker" src={marker} alt="" />
          <div id="marker-count">{markers.length}</div>
      </button>
      <div className={`markers-panel ${panelOpen? 'show' : ''}`}>
        <MarkersPanel 
          markers={markers}  
          onViewMarker={setMapView} 
          onClearMarkers={clearMarkers} 
          setIsOverMarkerPanel={setIsOverMarkerPanel} 
          updateMarkerIcon={updateMarkerIcon}
          updateMarkerName={updateMarkerName}
          onRemoveMarker={(markerId) => {
            console.log('Requesting to remove marker with ID:', markerId);
            setMarkers((prevMarkers) => prevMarkers.filter((m) => m.id !== markerId));            
          }}
          onClosePanel={switchPanel}
        />
      </div>
      
    </>
);
}
export default Markers;