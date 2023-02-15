import React from 'react'
import './home.styles.scss'

import Content from '../Content/Content'

export default function Home() {
  return (
    <div className='container'>
        <nav className='nav-bar'>
            <ul className='nav-ul'>
                <li className='nav-li'>
                    <a className='nav-link'> employee table </a>
                </li>
            </ul>
        </nav>

        <div className='content-div'>
            <Content />
        </div>
    </div>
  )
}
