import './App.css'
import Wrapper from './components/Wrapper'
import { useState, useEffect } from 'react'

function App() {

  // const[locations, setLocations] = useState(()=>{
  //   const tempJson = localStorage.getItem("coordinates")
  //   if(tempJson==null) return []
  
  //   return JSON.parse(tempJson)
  //   })
  
  //   useEffect(()=>{
  //       localStorage.setItem("coordinates", JSON.stringify(locations))
  //   },[locations])

  return (
    <>
     {/* <Wrapper locations={locations} setLocations={setLocations}/> */}
     <Wrapper/>

    </>
  )
}

export default App
