import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';
import { BsTrash } from 'react-icons/bs';

export default function Todo(props: TodoProps) {

    const todosRef = useRef<HTMLUListElement>(null);

    const [serverTodos] = useDocumentOnce(doc(db, props.path + props.id))

    useEffect(() => {
        if (serverTodos?.data()?.content) {
            setTodos([...serverTodos.data()?.content]);
        }
    }, [serverTodos])

    const [todos, setTodos] = useState([{title: '', completed: false}] as TodoItem[])

    useEffect(() => {
        const unsub = setTimeout(() => {
            setDoc(doc(db, props.path + props.id), {content: todos}, {merge: true})
        }, 1000);

        return () => {
            clearTimeout(unsub);
        }
    }, [todos])

    const handleTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index : number) => {
        if (event.key === 'Enter'){
            event.preventDefault();

            const newTodos = [...todos];
            newTodos.splice(index + 1, 0, {
                title: '',
                completed: false
            });

            setTodos(newTodos);
        } else if (event.key === 'Backspace' && todos[index].title === '' && index !== 0) {
            event.preventDefault();
            
            const newTodos = [...todos];
            newTodos.splice(index, 1);
            
            const prevLi = todosRef.current?.querySelector(`#Todo-${index - 1}`) as HTMLLIElement;
            const prevInput = prevLi.querySelector('input[type="text"]') as HTMLInputElement;
            prevInput.focus();
            
            setTodos(newTodos);
        } else if (event.key === 'ArrowUp' && index !== 0) {
            event.preventDefault();

            const prevLi = todosRef.current?.querySelector(`#Todo-${index - 1}`) as HTMLLIElement;
            const prevInput = prevLi.querySelector('input[type="text"]') as HTMLInputElement;
            prevInput.focus();
        } else if (event.key === 'ArrowDown' && index !== todos.length - 1) {
            event.preventDefault();

            const nextLi = todosRef.current?.querySelector(`#Todo-${index + 1}`) as HTMLLIElement;
            const nextInput = nextLi.querySelector('input[type="text"]') as HTMLInputElement;
            nextInput.focus();
        }
    }

    const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>, index : number) => {
        const newTodos = [...todos];
        newTodos[index].title = event.target.value;
        setTodos(newTodos);
    }

    const handleTodoCheck = (event: React.ChangeEvent<HTMLInputElement>, index : number) => {
        const newTodos = [...todos];
        newTodos[index].completed = event.target.checked;
        setTodos(newTodos);
    }

    const handleDocDelete = () => {
        deleteDoc(doc(db, props.path + props.id));
    }

  return (
    <li className='v-gap-s'>
        <div className='between'>
            <h3>Todo</h3>
            <button className='round-btn inv-btn' onClick={() => handleDocDelete()}><BsTrash /></button>
        </div>
        <ul className='v-gap-xs' ref={todosRef}>
            {todos?.map((todo, index) => (
                <li className='r-gap-s' key={index} id={`Todo-${index}`}>
                    <input type="checkbox" checked={todo.completed} onChange={(e) => handleTodoCheck(e, index)} />
                    <input autoFocus className='text-input' type="text" value={todo.title} onKeyDown={(e) => handleTodoKeyDown(e, index)} onChange={(e) => handleTodoChange(e, index)} placeholder="Enter Todo" />
                </li>
            ))}
        </ul>
    </li>
  )
}

interface TodoProps {
    path: string;
    id: string;
}

interface TodoItem {
    title: string;
    completed: boolean;
}