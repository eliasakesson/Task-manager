import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { BsTrash } from 'react-icons/bs';
import { db } from '../../firebase';

export default function ListItem(props: ListItemProps) {

    const ListsRef = useRef<HTMLUListElement>(null);

    const [serverLists] = useDocumentOnce(doc(db, props.path + props.id))

    useEffect(() => {
        if (serverLists?.data()?.content) {
            setLists([...serverLists.data()?.content]);
        }
    }, [serverLists])

    const [lists, setLists] = useState([{title: '', completed: false}] as ListItemItem[])

    useEffect(() => {
        const unsub = setTimeout(() => {
            setDoc(doc(db, props.path + props.id), {content: lists}, {merge: true})
        }, 1000);

        return () => {
            clearTimeout(unsub);
        }
    }, [lists])

    const handleListKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index : number) => {
        if (event.key === 'Enter'){
            event.preventDefault();

            const newLists = [...lists];
            newLists.splice(index + 1, 0, {
                title: '',
                completed: false
            });

            setLists(newLists);
        } else if (event.key === 'Backspace' && lists[index].title === '' && index !== 0) {
            event.preventDefault();
            
            const newLists = [...lists];
            newLists.splice(index, 1);
            
            const prevLi = ListsRef.current?.querySelector(`#Todo-${index - 1}`) as HTMLLIElement;
            const prevInput = prevLi.querySelector('input[type="text"]') as HTMLInputElement;
            prevInput.focus();
            
            setLists(newLists);
        } else if (event.key === 'ArrowUp' && index !== 0) {
            event.preventDefault();

            const prevLi = ListsRef.current?.querySelector(`#Todo-${index - 1}`) as HTMLLIElement;
            const prevInput = prevLi.querySelector('input[type="text"]') as HTMLInputElement;
            prevInput.focus();
        } else if (event.key === 'ArrowDown' && index !== lists.length - 1) {
            event.preventDefault();

            const nextLi = ListsRef.current?.querySelector(`#Todo-${index + 1}`) as HTMLLIElement;
            const nextInput = nextLi.querySelector('input[type="text"]') as HTMLInputElement;
            nextInput.focus();
        }
    }

    const handleListChange = (event: React.ChangeEvent<HTMLInputElement>, index : number) => {
        const newLists = [...lists];
        newLists[index].title = event.target.value;
        setLists(newLists);
    }

    const handleDocDelete = () => {
        deleteDoc(doc(db, props.path + props.id));
    }

  return (
    <li className='v-gap-s'>
        <div className='between'>
            <h3>List</h3>
            <button className='round-btn inv-btn' onClick={() => handleDocDelete()}><BsTrash /></button>
        </div>
        <ul className='v-gap-xs' ref={ListsRef} style={{listStyleType: "decimal", marginLeft: "1rem"}}>
            {lists?.map((list, index) => (
                <li key={index} id={`Todo-${index}`}>
                    <input autoFocus className='text-input' type="text" value={list.title} onKeyDown={(e) => handleListKeyDown(e, index)} onChange={(e) => handleListChange(e, index)} placeholder="Enter List Item" />
                </li>
            ))}
        </ul>
    </li>
  )
}

interface ListItemProps {
    path: string;
    id: string;
}

interface ListItemItem {
    title: string;
    completed: boolean;
}