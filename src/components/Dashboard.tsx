import React from 'react'
import Sidebar from './Sidebar'

export default function Dashboard(props : any) {
  return (
    <div className='sidebar-container'>
      <Sidebar />
      <main>
        <header>
          <h3>Header</h3>
        </header>
        <section className={`dashboard p-block-s ${props.className}`}>
            {props.children}    
        </section>
      </main>
    </div>
  )
}
