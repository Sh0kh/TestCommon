import React from 'react'
import '../Style/Header.css'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
function Header() {
  const location = useLocation()
  const Test = location.pathname === '/'
  const Result = location.pathname === '/result'
  return (
    <header>
        <div className='header__wrapper'>
            <NavLink className={`${Test ? `active_page` : ``}`} to='/'>
                
            </NavLink >
            <NavLink className={`${Result ? `active_page` : ''} `} to='/result'>
                
            </NavLink>
        </div>
    </header>
  )
}

export default Header