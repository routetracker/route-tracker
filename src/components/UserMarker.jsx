import React, {useState, useEffect} from 'react'
import MarkerIconPanel from "./markers/MarkerIconPanel";
import { Marker, useMap, Popup } from "react-leaflet";
import markerIcon from "../assets/marker-icon.png";


const UserMarker = () => {

    const [userPos, setUserPos] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(() => {
        const storedIcon = localStorage.getItem('selectedIcon');
        return storedIcon ? storedIcon : null;
      });
    
    useEffect(() => {
    localStorage.setItem('selectedIcon', selectedIcon);
    }, [selectedIcon]);
    const map = useMap();
  
    useEffect(() => {
      map.locate().once("locationfound", (e) => {
        setUserPos(e.latlng);
      });
    }, [map]);
    
    const defaultIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const getMarkerIcon = (selectedIcon, defaultIcon) => {
      const iconUrl = selectedIcon || defaultIcon.options.iconUrl;
    
      if (selectedIcon) {
        console.log('selected');

        return new L.Icon({
          iconUrl: selectedIcon,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      } else if (defaultIcon.options.iconUrl === iconUrl) {
        console.log('default');

        return new L.Icon({
          iconUrl: iconUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      } else {
        return selectedIcon || defaultIcon;
      }
    };
  
    const handleIconChange = (selectedIcon) => {
      console.log(selectedIcon);
      setSelectedIcon(selectedIcon);
    }; 
  
  
    const markerIconToUse = getMarkerIcon(selectedIcon, defaultIcon);

    return userPos === null ? null : (
      <Marker position={userPos} icon={markerIconToUse}>
        <Popup>
          <div className="icon-menu">
            <MarkerIconPanel onSelectIcon={handleIconChange} />
          </div>
          <div style={{margin: '0.4rem', color: 'midnightblue'}}>{`Lat: ${userPos.lat}, Lng: ${userPos.lng}`}</div>
        </Popup>
      </Marker>
    );
  };

export default UserMarker