import React, { useState, useEffect } from 'react'
import Map from './Map';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";

const Wrapper = () => {
   
  return (
    <div>
      <Map></Map>      
    </div>
  )
}

export default Wrapper