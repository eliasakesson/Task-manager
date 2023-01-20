import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/global.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Board from './pages/dashboard/Board';
import Boards from './pages/dashboard/Boards';
import Home from './pages/dashboard/Home';
import Tasks from './pages/dashboard/Tasks';
import QuickNotes from './pages/dashboard/QuickNotes';
import E404 from './pages/E404';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Home />} />
      <Route path='/board' element={<Board />} />
      <Route path='/boards' element={<Boards />} />
      <Route path='/tasks' element={<Tasks />} />
      <Route path='/quicknotes' element={<QuickNotes />} />
      <Route path='*' element={<E404 />} />
    </Routes>
  )
}