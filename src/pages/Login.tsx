import React, { useEffect, useState } from 'react'
import '../styles/login.css'

import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth'
import { auth } from '../firebase'

import { useAuthState } from 'react-firebase-hooks/auth'

export default function Login() {

  const [user, loading, error] = useAuthState(auth)

  function SignInWithGoogle(e : React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).then((result) => {
      // Signed in
      }).catch((error) => {
        alert(ReturnErrorString(error.message))
      });
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function SignInWithEmail(e : React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
    }).catch((error) => {
      alert(ReturnErrorString(error.message))
    });
  }

  function ReturnErrorString(error : string){
    const errorString = error.replace("Firebase: Error (auth/", "").replace(").", "").replace("-", " ")
    return errorString.charAt(0).toUpperCase() + errorString.slice(1)
  }

  useEffect(() => {
    if(user){
      window.location.href = '/dashboard'
    }
  }, [user])

  return (
    <div className='login container split'>
        <div className='left p-block'>
            
        </div>
        <div className='right p-block v-gap-l'>
            <div className='v-gap-s'>
                <h1>Welcome back</h1>
                <p>Please enter your details.</p>
                {user?.displayName}
            </div>
            <form className='v-gap' onSubmit={(e) => SignInWithEmail(e)}>
                <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" className='black-btn' value="Log In" />
                <div className='divider'>
                  <span></span>
                  <p>or</p>
                  <span></span>
                </div>
                <button className='border-btn' onClick={(e) => SignInWithGoogle(e)}><FcGoogle size={30} />Sign in with Google</button>
            </form>
            <p style={{fontSize: "1rem"}}>Don't have an account? <Link to="/">Sign up</Link></p>
        </div>
    </div>
  )
}
