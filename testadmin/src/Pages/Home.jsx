import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import '../Style/Home.css'
import Sidebar from '../Components/Sidebar'
function Home() {
  const [isSidebarFull, setIsSidebarFull] = useState(false);
  return (
    <div className='Home'>
        <div className='Home__wrapper'>
        <div className='side'>
        <Sidebar isFull={isSidebarFull } toggleSidebar={() => setIsSidebarFull(!isSidebarFull)}/>
        </div>
       <div className='Out'>
       <Outlet context={{ setIsSidebarFull }}/>
       </div>
        </div>
    </div>
  )
}

export default Home