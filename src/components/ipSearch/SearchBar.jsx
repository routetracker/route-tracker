import React, {useState} from 'react'

const SearchBar = ({ setIPAddress, fetchLocation }) => {
   
    const [ipAddress, setIpAddress] = useState('')
    
    const handleClick = () => {
        setIpAddress(ipAddress)
        fetchLocation(ipAddress)
    }

  return (
        <div className='ip-search-bar'>
            <input className='ip-input'
            type="text"
            placeholder='Enter the IP Address here'
             onChange={(e)=> setIpAddress(e.target.value)}/>
            <div id='ip-button' onClick={handleClick}> 
                Search IP
            </div>
        </div>
  )
}

export default SearchBar