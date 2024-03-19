import React, { useState, useEffect, useCallback } from 'react';
import { Polyline, useMap, useMapEvents } from 'react-leaflet';
import arrowLeft from '../../assets/arrow-left-solid.svg';

const RouteTracker = ({ onRecordStart, onRecordStop, routePanelSwitch }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false)
  const [watchId, setWatchId] = useState(null);
  const [currentRoute, setCurrentRoute] = useState([]);
  const [drawnPolyline, setDrawnPolyline] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isOverMarkerPanel, setIsOverMarkerPanel] = useState(false);

  const map = useMap();



  const startRecording = useCallback(() => {
    const newWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoordinate = [latitude, longitude];
        onRecordStart(newCoordinate);
        setCurrentRoute((prevRoute) => [...prevRoute, newCoordinate]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
    setWatchId(newWatchId);
    setIsRecording(true);
  }, [onRecordStart]);

  const stopRecording = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsRecording(false);
      onRecordStop();
    }
  }, [watchId, onRecordStop]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);


  const startDrawing = () => {
    setDrawnPolyline([]);
    setIsDrawing(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    // setDrawnPolyline((prevPolyline) => prevPolyline.slice(0, -1));
  }

  const handleMapClick = (e) => {
    if (isDrawing) {
      const newCoordinate = [e.latlng.lat, e.latlng.lng];
      setDrawnPolyline((prevPolyline) => {
        const updatedPolyline = [...prevPolyline, newCoordinate];
        if (updatedPolyline.length > 1) {
          setDistance(calculateDistance(updatedPolyline).toFixed(2));
        }
        return updatedPolyline;
      });
    }
  }
  // "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive leaflet-marker-draggable" 

  useMapEvents({
    click: (e) => {
        const isButtonOrPanel = e.originalEvent.target.closest(`.route-box, .route-panel, button, .markers-panel, .ip-box, leaflet-marker-icon`);
         if (!isButtonOrPanel) {
          handleMapClick(e)
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

  const handleEnter = () => {
    setIsOverMarkerPanel(true);
  };

  const handleLeave = () => {
    setIsOverMarkerPanel(false);
  };

  const calculateDistance = (coordinates) => {
    let distance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const prevCoord = coordinates[i - 1];
      const currentCoord = coordinates[i];
      // DeltaLat is the difference of the end latitude and the start latitude, the same for longitude
      //Δlat
      const dLat = toRadians(currentCoord[0] - prevCoord[0]);
      //Δlon
      const dLng = toRadians(currentCoord[1] - prevCoord[1]);
      //Angular separation calculates the distance of A to B transforming into an arc, considering the central angle at the center of Earth
      //Angular separation between the two points using the haversine of the differences in latitudes and longitudes.
      // haversine(Δθ)= sin2(2Δlat) + cos(lat1) * cos(lat2) * sin2(2Δlon​)
      //angularSeparation = haversine(dLat) + cos(lat2) * cos(lat1) * haversine(dLng)
      const a =
        //Square of Δlat
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        //Cossine of lat1, starting latitude
        //Latitude and longitude are calculated in radians
        Math.cos(toRadians(prevCoord[0])) *
        //Cossine of lat2, ending latitude
        Math.cos(toRadians(currentCoord[0])) *
        //Square of Δlon
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      //Calculate Central Angle:
      //centralAngle = 2 * arctangent2(sqrt(angularSeparation), sqrt(1 - angularSeparation))
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // Earth's radius in km
      const radius = 6371;
      //Adding the distance between each pair of coordinates
      distance += radius * c;
    }
    return distance;
  };

  const toRadians = (angle) => {
    return (angle * Math.PI) / 180;
  };

  const handleClosePanel = () => {
    routePanelSwitch(false);
  };


  return (
    <div className='route-panel'
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
        >
      <div className='route-header'>
        <h2 className='route-title'>Route Tracker</h2>
        <button className='route-close' onClick={handleClosePanel}>
          <img id='panel-arrow' src={arrowLeft} alt='' />
        </button>
      </div>
      <div className='route-tracked'>
        {isRecording ? (
          <div>
            <button onClick={stopRecording}>Stop Recording</button>
          </div>
        ) : (
          <div>
            <button onClick={startRecording}>Start Recording</button>
          </div>
        )
        }
        <p>Distance Traveled: {calculateDistance(currentRoute).toFixed(2)} km</p>
        {currentRoute.length > 1 && <Polyline positions={currentRoute} color='blue' />}
      </div>
      <div className='route-drawn'>
        {isDrawing ? (
            <div>
              <button onClick={stopDrawing}>Stop Drawing</button>
            </div>
          ) : (
            <div>
              <button onClick={startDrawing}>Start Drawing</button>
            </div>
          )
        }
        <p>Distance Traveled: {calculateDistance(drawnPolyline).toFixed(2)} km</p>
        {drawnPolyline.length > 0 && <Polyline positions={drawnPolyline} color='red' />}
      </div>
    </div>
  );
};

export default RouteTracker;