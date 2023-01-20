import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/landing.css'

import { FaTasks, FaBusinessTime, FaBook, FaHandshake } from 'react-icons/fa'

export default function Landing() {
  return (
    <div className='landing'>
      {/* Header */}
        <header className='between'>
            <div className='r-gap'>
              <img src="" alt='' />
              <h2>Taskeer</h2>
              <ul className='r-gap'>
                <li className='link'><Link to="/">Product</Link></li>
                <li className='link'><Link to="/">Solutions</Link></li>
                <li className='link'><Link to="/">Company</Link></li>
                <li className='link'><Link to="/">Pricing</Link></li>
              </ul>
            </div>
            <div className='r-gap'>
              <Link className='inv-btn' to="/login">Login</Link>
              <Link className='black-btn' to="/">Get Started</Link>
            </div>
        </header>
        {/* Hero */}
        <section className='hero split'>
          <div className='p-block header-margin v-gap'>
            <h1><span className='highlight'>Organize</span><br /> your life with one tool.</h1>
            <p>Learn how hundreds of companies use Devup to create delightful employee experiences every day.</p>
            <div className='r-gap'>
              <Link className='black-btn' to="/">Get Started</Link>
              <Link className='inv-btn' to="/">How it works?</Link>
            </div>
          </div>
          <div className='half-img'>
            <div className='img-half-bg'></div>
            <img src="hero.png" alt='' />
          </div>
        </section>
        <section className='split'>
          <div className='p-block v-gap-l'>
            <h2>Get everything<br /> done in one place.</h2>
            <div className='grid'>
              <div className='v-gap-s'>
                <FaTasks className='icon' />
                <h3>Manage tasks</h3>
                <p>Devup helps you manage your tasks and projects in one place.</p>
              </div>
              <div className='v-gap-s'>
                <FaBusinessTime className='icon' />
                <h3>Productivity</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
              <div className='v-gap-s'>
                <FaBook className='icon' />
                <h3>Knowledge</h3>
                <p>Devup helps you manage your tasks and projects in one place.</p>
              </div>
              <div className='v-gap-s'>
                <FaHandshake className='icon' />
                <h3>Collaboration</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
            </div>
          </div>
          <div>
            <img src="" alt='' />
          </div>
        </section>
    </div>
  )
}
