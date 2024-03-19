import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import Stats from './Stats';
import arrowLeft from '../../assets/arrow-left-solid.svg'
import { useMap } from 'react-leaflet';

const IPAddress = ({ onCoordinatesChange, onCloseIpPanel }) => {
  const [IPAddress, setIPAddress] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [ISP, setISP] = useState('');
  const [coordinates, setCoordinates] = useState({});

  const [remainingRequests, setRemainingRequests] = useState(50);

  const [timer, setTimer] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;  

  const fetchLocation = (ipAddress = '') => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      fetch(        
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`
      )
      .then(response => {
        if (response.status === 429) {
          console.error('Rate limit exceeded. Please wait before making more requests.');
        } else if (response.ok) {
          return response.json();
        } else {
          console.error('Error:', response.statusText);
        }
      })
        .then((data) => {
         
          console.log(data);
          setIPAddress(data.ip);
          setLocation(`
            ${data.location.city}, 
            ${data.location.country}, 
            ${data.location.postalCode}`);
          setTimezone(`UTC: ${data.location.timezone}`);
          setISP(`${data.isp}`);
          setCoordinates({ lat: data.location.lat, lng: data.location.lng });
          onCoordinatesChange({ lat: data.location.lat, lng: data.location.lng })
        })
        .catch((error) => console.error('Error fetching location:', error))
        .finally(() => {
          setRemainingRequests((prev) => (prev > 0 ? prev - 1 : 0));
        });
    }, 1000); 
    setTimer(newTimer);
  };

  const handleIpPanel = () => {
    onCloseIpPanel(false)
  }

  const [isOverMarkerPanel, setIsOverMarkerPanel] = useState(false);
  const map = useMap()

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


  return (
    <div className='ip-wrapper'
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>
     <div className="ip-panel-header">
        <h2>IP Address Tracker</h2>
        <button className="ip-panel-close" onClick={handleIpPanel}>
          <img id="panel-arrow"src={arrowLeft} alt="" />
        </button>
     </div>
      <SearchBar setIPAddress={setIPAddress} fetchLocation={fetchLocation} />
        <div className="ip-stats">
          <Stats
            ipAddress={IPAddress}
            location={location}
            timezone={timezone}
            isp={ISP}
            remainingRequests={remainingRequests}
          />
        </div>
    </div>
  );
};

export default IPAddress;