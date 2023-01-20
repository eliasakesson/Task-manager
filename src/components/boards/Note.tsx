import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { BsTrash } from 'react-icons/bs';
import { db } from '../../firebase';

export default function Note(props : NoteProps) {

    const [serverNote] = useDocumentOnce(doc(db, props.path + props.id))

    useEffect(() => {
        if (serverNote?.data()?.content) {
            setNote(serverNote.data()?.content);
        }
    }, [serverNote])

    const [note, setNote] = useState('')

    useEffect(() => {
        if (!note) return;

        const unsub = setTimeout(() => {
            setDoc(doc(db, props.path + props.id), {content: note}, {merge: true})
        }, 1000);

        return () => {
            clearTimeout(unsub);
        }
    }, [note, props.id, props.path])

    const handleDocDelete = () => {
        deleteDoc(doc(db, props.path + props.id));
    }

  return (
    <li className='v-gap-s'>
        <div className='between'>
            <h3>Note</h3>
            <button className='round-btn inv-btn' onClick={() => handleDocDelete()}><BsTrash /></button>
        </div>
        <textarea style={{height: "unset"}} placeholder='Enter Text' className='text-input' value={note} onChange={(e) => setNote(e.target.value)}></textarea>
    </li>
  )
}

interface NoteProps {
    path: string;
    id: string;
}