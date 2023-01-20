import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'

export default function QuickNote(props: QuickNoteProps) {

  const [note] = useDocumentOnce(doc(db, props.path + props.id))

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.data()?.title)
      setText(note.data()?.text)
    }
  }, [note])

  useEffect(() => {
    const unsub = setTimeout(() => {
      setDoc(doc(db, props.path + props.id), {
        title: title,
        text: text
      })
    }, 1000)

    return () => {
      clearTimeout(unsub)
    }
  }, [title, text, props.id, props.path])

  return (
    <div>
      <input className='text-input' type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className='text-input' placeholder="Text" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  )
}

interface QuickNoteProps {
  path: string,
  id: string
}