import React from 'react'

const Stats = ({
    ipAddress, 
    location, 
    timezone, 
    isp}) => {
  return (
    <div className='stats'>
        <div>
            <p className='ip-item-title'>IP Address:</p>
            <p>{ipAddress}</p>
        </div>
        <div>
            <p className='ip-item-title'>Location:</p>
            <p>{location}</p>
        </div>
        <div>
            <p className='ip-item-title'>Timezone:</p>
            <p>{timezone}</p>
        </div>
        <div>
            <p className='ip-item-title'>ISP:</p>
            <p>{isp}</p>
        </div>
    </div>
  )
}

export default Stats