import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { db } from '../../firebase';
import { MdOutlineEdit } from 'react-icons/md';
import Dashboard from '../../components/Dashboard';

export default function Boards() {

    // Get boards from database
    const [boards, loading, error] = useCollection(collection(db, 'boards'), {
        snapshotListenOptions: { includeMetadataChanges: true },
    });

    const [boardList, setBoardList] = useState<any>([])

    useEffect(() => {
        if (boards) {
            setBoardList(boards.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
    }, [boards])

    const [addingBoard, setAddingBoard] = useState(false)

    const [title, setTitle] = useState('')
    const [color, setColor] = useState("#D3D3D3")

    const colors = ["#FFA07A", "#6699CC", "#6C7B8B", "#6B8E23", "#BA55D3", "#DAA520", "#00BFBF", "#0000CD", "#F08080", "#CD5C5C", "#C71585", "#F0E68C", "#00FF00", "#D3D3D3", "#FF7F50"]

    function AddBoard(){
        if (!title) {
            alert('Please enter a title')
            return
        }
        if (!color) {
            alert('Please select a color')
            return
        }
        
        addDoc(collection(db, 'boards'), {
            Title: title,
            Color: color
        })

        setAddingBoard(false)
    }

  return (
    <Dashboard className="v-gap">
        <h1>Task Boards</h1>
        <div className='wrap'>
            {boardList.map((board : any) => (
                <BoardUI key={board.id} board={board} />
            ))}
            <button className='card skeleton center v-gap-s' onClick={() => setAddingBoard(true)}>
                <span>+</span>
                <h2>Add Board</h2>
            </button>
        </div>
        {addingBoard && 
            <div className='modal-bg center'>
                <div className="card large-card v-gap p-block-s">
                    <button className='border-btn tr-btn' onClick={() => setAddingBoard(false)}>X</button>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    <label>Color</label>
                    <ul className='r-gap-xs'>
                        {colors.map((color) => (
                            <li className='square' style={{backgroundColor: color}} onClick={() => setColor(color)}></li>
                        ))}
                    </ul>
                    <label>Custom Color</label>
                    <input type="color" className='color-input' value={color} onChange={(e) => setColor(e.target.value)} />
                    <label>Create</label>
                    <button className='primary-btn' onClick={() => AddBoard()}>Create Board</button>
                </div>
            </div>}
    </Dashboard>
  )
}

function BoardUI(props : any) {

    const [editMode, setEditMode] = useState(false)

    const [title, setTitle] = useState(props.board.Title)
    const [color, setColor] = useState(props.board.Color || '#FF0000')

    const colors = ["#E53935", "#F57C00", "#FFEB3B", "#43A047", "#03A9F4", "#1E88E5", "#5E35B1", "#9C27B0", "#E91E63"]

    function setDocument(){
        setDoc(doc(db, 'boards/' + props.board.id), {Title: title, Color: color}, {merge: true})
    }

    useEffect(() => {
        const unsub = setTimeout(() => {
            setDocument()
        }, 1000)

        return () => { clearTimeout(unsub) }
    }, [title, color])

    function DeleteBoard(){
        deleteDoc(doc(db, 'boards/' + props.board.id))
    }

    return (
        <div className='card'>
            <Link to={`/board?id=${props.board.id}`} key={props.board.id} className="p v-gap">
                <div className='card-color' style={{backgroundColor: props.board.Color}}></div>
                <h2>{props.board.Title}</h2>
                <p>2 Lists, 3 Tasks</p>
                <div className='progress-bar'>
                    <div className='fill'></div>
                </div>
                <p style={{marginTop: "auto"}}>Last updated: <span>7 Jan, 2023</span></p>
            </Link>
            <button className='border-btn tr-btn' onClick={(e) => setEditMode(!editMode)}><MdOutlineEdit /></button>
            <div className='popup v-gap-s' style={{display: editMode ? "flex" : "none"}}>
                <button className='border-btn tr-btn round-btn' onClick={() => {setDocument(); setEditMode(false)}}>X</button>
                <label>Title</label>
                <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label>Color</label>
                <ul className='r-gap-xs'>
                    {colors.map((color) => (
                        <li className='color-square' style={{backgroundColor: color}} onClick={() => setColor(color)}></li>
                    ))}
                </ul>
                <label>Custom Color</label>
                <input type="color" className='color-input' value={color} onChange={(e) => setColor(e.target.value)} />
                <label style={{marginTop: "auto"}}>Delete</label>
                <button className='delete-btn' onClick={() => DeleteBoard()}>Delete Board</button>
            </div>
        </div>
    )
}