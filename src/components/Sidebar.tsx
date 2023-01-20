import React, { useEffect, useState } from 'react'
import { MdOutlineSpaceDashboard, MdTaskAlt, MdNotes } from 'react-icons/md'
import { BsHouseDoor, BsChevronDown, BsChevronRight } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function Sidebar() {

  const [open, setOpen] = useState(false)
  const [boardsOpen, setBoardsOpen] = useState(false)
  const [route, setRoute] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    setRoute(window.location.pathname)
  }, [])

  // Get boards from database
  const [boards] = useCollection(collection(db, 'boards'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [boardList, setBoardList] = useState<any>([])

  useEffect(() => {
      if (boards) {
          setBoardList(boards.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
  }, [boards])

  return (
    <aside className={`sidebar v-gap ${open ? "open" : "closed"}`}>
        {/* Logo */}
        <div className='top'>
          <div className='logo'>
            <img src="" alt="" />
          </div>
          <button className='collapse-btn center' onClick={() => {open && setBoardsOpen(false); setOpen(!open);}}><BsChevronRight /></button>
        </div>
        {/* Menu */}
        <ul className='links v-gap-s'>
          <li className={route === "/dashboard" ? "selected" : ""}><Link to="/dashboard"><BsHouseDoor /><span>Dashboard</span></Link></li>
          <li className={`${boardsOpen ? "open" : ""} ${(route === "/boards" || route === "/board") ? "selected" : ""}`} onClick={() => {open ? setBoardsOpen(!boardsOpen) : navigate("/boards")}}><button><MdOutlineSpaceDashboard /><span>Boards</span><BsChevronDown style={{marginLeft: "auto", display: open ? "block" : "none"}} /></button>
            <ul className='v-gap'>
              <li><Link to="/boards"><span>All Boards</span></Link></li>
              {boardList?.length > 0 && <li><h3>Recent Boards</h3></li>}
              {boardList?.map((board: any) => (
                <li key={board.id}><Link to={`/board?id=${board.id}`}><span>{board.Title}</span></Link></li>
              ))}
            </ul></li>
            <li className={route === "/tasks" ? "selected" : ""}><Link to="/tasks"><MdTaskAlt /><span>Tasks</span></Link></li>
            <li className={route === "/quicknotes" ? "selected" : ""}><Link to="/quicknotes"><MdNotes /><span>Quick Notes</span></Link></li>
        </ul>
    </aside>
  )
}
