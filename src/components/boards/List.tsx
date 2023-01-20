import React, { useEffect, useState } from 'react'
import { db } from '../../firebase';
import { useCollection, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { collection, doc, addDoc, setDoc, getCountFromServer, orderBy, query, deleteDoc } from 'firebase/firestore';
import { BsTrash } from 'react-icons/bs';
import Todo from './Todo';
import Note from './Note';
import ListItem from './ListItem';

export default function List(props : ListProps) {

    // Get list document from Firestore
    const [document, loading] = useDocumentOnce(doc(db, 'boards/' + props.boardId + '/lists', props.documentId))

    const [docData, setDocData] = useState<any>(null)

    useEffect(() => {
        if (document) {
            setDocData(document.data())
        }
    }, [document])

    // Get tasks collection from Firestore
    const [tasks] = useCollection(query(collection(db, 'boards/' + props.boardId + '/lists/' + props.documentId + "/tasks"), orderBy("Order", "desc")), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    const [taskList, setTaskList] = useState<any[]>([])

    useEffect(() => {
        if (tasks) {
            setTaskList(tasks.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
    }, [tasks])

    // Add task

    async function addTask() {
        const path = 'boards/' + props.boardId + '/lists/' + props.documentId + "/tasks";

        const coll = collection(db, path);
        const snapshot = await getCountFromServer(coll);
        const newTask = {
            Title: 'New Task',
            Order: snapshot.data().count
        }
        await addDoc(collection(db, path), newTask)
    }

    const [listName, setListName] = useState<string>("")

    useEffect(() => {
        setListName(docData?.title)
    }, [docData])

    useEffect(() => {
        if (!listName) return;

        const unsub = setTimeout(() => {
            setDoc(doc(db, 'boards/' + props.boardId + '/lists', props.documentId), {title: listName}, {merge: true})
        }, 1000)

        return () => {
            clearTimeout(unsub)
        }
    }, [listName])

    const handleListDelete = () => {
        deleteDoc(doc(db, `boards/${props.boardId}/lists/${props.id}`))
    }

     return (
        <div className='v-gap'>
            <div className='r-gap-s'>
                <input type="text" placeholder="List Name" className='header-input' value={listName || ""} onChange={(e) => setListName(e.target.value)} />
                {!loading && 
                    <>
                        <span className=''>{taskList?.length}</span>
                        <button style={{marginLeft: "auto"}} className='black-btn round-btn center' onClick={() => addTask()}>+</button>
                        <button className='round-btn inv-btn' onClick={() => handleListDelete()}><BsTrash /></button>
                    </>
                }
            </div>
            <ul className='v-gap'>
                {taskList.length > 0 && taskList.map((task, i) => (
                    <Task key={i} i={i} {...task} path={`boards/${props.boardId}/lists/${props.documentId}/tasks/`} />
                ))}
                {taskList.length === 0 && 
                <li className='p card center v-gap-s skeleton'>
                    <h3>No tasks</h3>
                    <button className='black-btn' onClick={() => addTask()}>Add Task</button>
                </li>}
            </ul>
        </div>
  )
}

interface ListProps {
    boardId: string,
    documentId: string,
    id: number,
}

function Task(props : TaskProps) {
    // Get content collection from Firestore
    const [content] = useCollection(collection(db, props.path + props.id + "/content"), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    const [contentList, setContentList] = useState<any[]>([])

    const [isAdding, setIsAdding] = useState<boolean>(false)

    useEffect(() => {
        if (content) {
            setContentList(content.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
    }, [content])

    const handleContentAdd = (type: string) => {
        setIsAdding(false)
        addDoc(collection(db, props.path + props.id + "/content"), {Type: type})
    }

    const handleTaskDelete = () => {
        deleteDoc(doc(db, props.path + props.id))
    }

    const [taskName, setTaskName] = useState<string>("")

    useEffect(() => {
        setTaskName(props.title || "")
    }, [props.title])

    useEffect(() => {
        if (!taskName) return;

        const unsub = setTimeout(() => {
            setDoc(doc(db, props.path + props.id), {title: taskName}, {merge: true})
        }, 1000)

        return () => {
            clearTimeout(unsub)
        }
    }, [taskName])

    return (
        <li className='card v-gap p'>
            <div className="between">
                <input type="text" placeholder="Task Name" className='header-input' value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                <span className='r-gap-s'>
                    <span className='relative'>
                        <button className='black-btn round-btn center' onClick={() => setIsAdding(!isAdding)}>+</button>
                        <ul className='popup v-gap-xs' style={{display: isAdding ? "flex" : "none"}}>
                            <li><button className="border-btn" onClick={() => handleContentAdd("Note")}>New Note</button></li>
                            <li><button className="border-btn" onClick={() => handleContentAdd("Todo")}>New Todo</button></li>
                            <li><button className="border-btn" onClick={() => handleContentAdd("List")}>New List</button></li>
                        </ul>
                    </span>
                    <button className='inv-btn round-btn' onClick={() => handleTaskDelete()}><BsTrash /></button>
                </span>
            </div>
            <ul className="v-gap-s">
                {contentList?.map((content, i) => (
                    content.Type === 'Todo' ? 
                        <Todo key={i} path={props.path + props.id + "/content/"} id={contentList[i].id} />
                    : content.Type === 'List' ?
                        <ListItem key={i} path={props.path + props.id + "/content/"} id={contentList[i].id} />
                    :
                        <Note key={i} path={props.path + props.id + "/content/"} id={contentList[i].id} />
                ))}
            </ul>
        </li>
    )
}

interface TaskProps {
    title?: string,
    id: number,
    i: number,
    path: string,
}