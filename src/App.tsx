import React, {useRef, useState} from 'react'
import './App.scss'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import {initializeApp} from 'firebase/app'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth'
import {
	getFirestore,
	collection,
	query,
	orderBy,
	limit,
	addDoc,
	serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCSLCiL9bzc5AKIRPkpvLblDY9eVtzWxGg',
	authDomain: 'real-time-chat-5b1d5.firebaseapp.com',
	projectId: 'real-time-chat-5b1d5',
	storageBucket: 'real-time-chat-5b1d5.appspot.com',
	messagingSenderId: '819899231653',
	appId: '1:819899231653:web:5abd4fe4654f2c82a08c4c',
	measurementId: 'G-HWNJZPF5K5',
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

function App() {
	const [user, loading, error] = useAuthState(auth)

	return (
		<div className='App'>
			<header>Chat 	<SignOut /></header>
			<section>{user ? <ChatRoom /> : <SignIn />}</section>
		</div>
	)
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider()
		signInWithPopup(auth, provider)
	}
	return (
		<>
			<button className='sign-in' onClick={signInWithGoogle}>
				Entra com a conta do Google
			</button>
		</>
	)
}

function SignOut() {

	return (
		auth.currentUser && (
			<button className='sign-out' onClick={() => auth.signOut()}>
				Sair {auth.currentUser.displayName}
			</button>
		)
	)
}

function ChatRoom() {
	const forceBottomScrollElement = useRef<HTMLSpanElement>(null)
	const messagesRef = collection(firestore, 'messages')
	const dbQuery = query(messagesRef, orderBy('createdAt'), limit(25))

	const collectionDataOption: any = {idField: 'id'}
	const [messages, loading, error] = useCollectionData(
		dbQuery,
		collectionDataOption
	)

	const [formValue, setFormValue] = useState('')

	const sendMessage = async (e: any) => {
		e.preventDefault()

		const {uid, photoURL}: any = auth.currentUser

		const docRef = await addDoc(messagesRef, {
			text: formValue,
			createdAt: serverTimestamp(),
			uid,
			photoURL,
		})

		setFormValue('')
		//forceBottomScrollElement.current.scrollIntoView({behavior: 'smooth'})
	}

	return (
		<>
			<main>
				{messages &&
					messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

				<span ref={forceBottomScrollElement}></span>
			</main>

			<form onSubmit={sendMessage}>
				<input
					value={formValue}
					onChange={(e) => setFormValue(e.target.value)}
					placeholder='Vamos conversar'
				/>

				<button type='submit' disabled={!formValue}>
					Enviar
				</button>
			</form>
		</>
	)
}

function ChatMessage(props: any) {
	const {text, uid, photoURL} = props.message

	const messageClass = uid === auth?.currentUser?.uid ? 'sent' : 'received'

	console.log(text)

	return (
		<>
			<div className={`message ${messageClass}`}>
				<img
					src={
						photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
					}
				/>
				<p>{text}</p>
			</div>
		</>
	)
}

export default App
