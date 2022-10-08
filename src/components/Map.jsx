import React from 'react'

const Map = () => {
    let y = JSON.parse(localStorage.getItem('cityName'))
  return (
    <div>
        <iframe
          title="gmap"
          name="gMap"
          className="map"
          src={`https://maps.google.com/maps?q=${y}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
    </div>
  )
}

export default Map