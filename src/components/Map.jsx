import React, { useEffect, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import arrowRight from '../assets/arrow-right-solid.svg'
import Markers from "./markers/Markers";
import RouteTracker from './markers/RouteTracker';
import IPAddress from "./ipSearch/ipAddress";
import UserMarker from "./UserMarker";

/*test recording, save routes*/

L.Icon.Default.mergeOptions({
  iconAnchor: [12, 41],
});

const Map = () => { 
  
  const [userPos, setUserPos] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [initView, setinitView] = useState(true);
  const [routePanel, setRoutePanel] = useState(false)
  const [ipPanel, setIpPanel] = useState(false)
  const [ipCoordinates, setIpCoordinates] = useState(null)


  const [useOpenStreetMap, setUseOpenStreetMap] = useState({
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  });
    

  const tileLayerConfig = useOpenStreetMap ? {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    }
  : {
      url: 'https://maps.googleapis.com/maps/vt?&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
    };




  const handleToggleMap = () => {
    setUseOpenStreetMap((prev) => !prev);
  };
     
  
  const CenterView = () => {
    const map = useMap();
    
    const onClick = useCallback(() => {
      map.locate().once("locationfound", function (e) {
        map.setView(e.latlng); 
      });
    }, [map])     

    return (
      <button id='center-btn' onClick={onClick}>Center on User</button>       
    )
  }

  const SetViewOnUserLocation = ({ initView }) => {
    const map = useMap();

    useEffect(() => {
      if (initView) {
        map.locate();
        map.once('locationfound', (e) => {
          map.setView(e.latlng, map.getZoom());
          setinitView(false)
        });
      }
    }, [map, initView]);

    return null;
  };
  

  const handleRecordStart = (coordinate) => {
    setUserPos(coordinate);
    setRouteCoordinates((prevCoordinates) => [...prevCoordinates, coordinate]);
    if (initView) {
      setInitView(false);
    }
  };

  const handleRecordStop = () => {
  };
  
  const handleCoordinates = (newCoordinates) => {
    setIpCoordinates(newCoordinates);
  };
  
  const SetViewIp = () => {
    const map = useMap()
    useEffect(() => {  
      if (ipCoordinates && initView === false) {
        map.setView(ipCoordinates, map.getZoom());
      }  
    }, [ipCoordinates]);
  }

  const routePanelSwitch = () => {
    setRoutePanel(!routePanel)
    console.log("map: " ,routePanel)
  }

  const ipPanelSwitch = () => {
    setIpPanel(!ipPanel)
    console.log("map: " ,ipPanel)
  }

 
  return (
    <MapContainer 
      className="map"
       center={userPos || [48.856614, 2.3522219]} zoom={18}       
    >
    <TileLayer {...tileLayerConfig} />
        <button id="map-btn" onClick={handleToggleMap}>
          {useOpenStreetMap ? 'Switch to Google Maps' : 'Switch to OpenStreetMap'}
        </button>
      <SetViewOnUserLocation initView={initView} />
      <UserMarker/>
      <CenterView/>
      <Markers />
      <SetViewIp/>
      <div className="left-btn-tag">
        <div className="tag-text">Routes</div>
        <button className="route-open" onClick={routePanelSwitch}>
        <img className='arrow-right' src={arrowRight} alt="" />
        </button>
      </div>
      <div className={`route-box ${routePanel? 'show-route-panel' : ''}`}> 
        <RouteTracker onRecordStart={handleRecordStart} onRecordStop={handleRecordStop} routePanelSwitch={routePanelSwitch}/>
      </div>
      <div className="left-btn-ip-tag">
        <div className="tag-text-ip">IP Tracking</div>
        <button className='ip-panel-open' onClick={ipPanelSwitch}>
          <img className='arrow-right' src={arrowRight} alt="" />
        </button>
      </div>
      <div className={`ip-box ${ipPanel? 'show-ip' : ''}`}> 
          <IPAddress onCoordinatesChange={handleCoordinates} onCloseIpPanel={ipPanelSwitch}/>
      </div>  
    </MapContainer>
  );
};

export default Map;