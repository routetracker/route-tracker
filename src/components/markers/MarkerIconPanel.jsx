import React, { useState } from 'react'
import araucaria from '../../assets/Araucaria.svg';
import pine from '../../assets/Pine.svg';
import eucaliptus from '../../assets/Eucaliptus.svg';
import blackberry from '../../assets/Blackberry.svg'
import shrub from '../../assets/Shrub.svg'
import oak from '../../assets/Oak.svg'
import marker from '../../assets/marker.svg'
import palm from '../../assets/Palm.svg'
import jacaranda from '../../assets/Jacaranda.svg'
import fichus from '../../assets/Fichus.svg'
import ipe from '../../assets/Ipe.svg'
import cypress from '../../assets/Cipreste.svg'




const MarkerIconPanel = ({ onSelectIcon})=>{
    const [uploadedImages, setUploadedImages] = useState(() => {
      const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) 
      if(storedImages==null) return []
      return storedImages;
    });

  const preImportedIcons = [marker, ipe, jacaranda, fichus, palm, cypress, araucaria, pine, eucaliptus, blackberry, shrub, oak]; 

  const allIcons = [...preImportedIcons, ...uploadedImages];


  const handleSelectIcon = (selectedIcon) => {
    onSelectIcon(selectedIcon);
    // onOptionsClose();
  };

const handleUploadImage = (event) => {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;

    setUploadedImages((prevImages) => {
      const updatedImages = [...prevImages, base64Image];

      localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));

      return updatedImages;
    });
  };

  reader.readAsDataURL(file);
};


    return (
      <div className='icon-panel'>
        <h3 className='icon-title'>Icon Menu</h3>
        <div className="icon-box">
            {allIcons.map((icon, index) => (
              <img className='icons'
              key={index}
              src={icon}
              alt={`Icon ${index + 1}`}
              onClick={() => handleSelectIcon(icon)}
              style={{ cursor: 'pointer', marginRight: '5px' }}
              />
              ))}
          </div>
        <input id='input-file' type="file" accept="image/*" onChange={handleUploadImage} />
      </div>
    )
  }

export default MarkerIconPanel