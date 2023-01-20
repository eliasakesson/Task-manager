import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import List from '../../components/boards/List';
import Dashboard from '../../components/Dashboard';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Board() {

  const [searchParams] = useSearchParams()
  const boardId = searchParams.get('id') || ''

  const [lists] = useCollection(collection(db, 'boards/' + boardId + '/lists'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  const [listList, setListList] = useState<any[]>([])

  useEffect(() => {
    if (lists) {
      setListList(lists.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
  }, [lists])

  const handleAddList = () => {
    addDoc(collection(db, 'boards/' + boardId + '/lists'), {title: 'New List'})
  }

  return (
    <Dashboard className="v-gap">
      <h1>Board Lists</h1>
      <div className='r-gap-top'>
        {listList.map((list) => (
          <List key={list.id} id={list.id} boardId={boardId} documentId={list.id} />
        ))}
        <button className='border-btn skeleton' onClick={() => handleAddList()}>Add List</button>
      </div>
    </Dashboard>
  )
}
