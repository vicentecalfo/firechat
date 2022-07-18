import React, {useRef, useState} from 'react'
import './App.scss'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import {initializeApp} from 'firebase/app'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
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
			<header>
				<div className='logo'>
					<div>
						<img src='/logo.png' />
					</div>
					<div>
						<h1> Firechat</h1>
						<h2>React Firebase Chat</h2>
					</div>
				</div>
				<div className='user'>
					<SignOut />
				</div>
			</header>
			{user ? <ChatRoom /> : <SignIn />}
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
			<div className='sign-in'>
				<button onClick={signInWithGoogle}>
					<div>
						<img src='/google.png' />
					</div>
					<div>Sign in with Google</div>
				</button>
			</div>
		</>
	)
}

function SignOut() {
	return (
		auth.currentUser && (
			<div className='sign-out'>
				<img
					className='avatar'
					src={
						auth?.currentUser?.photoURL ||
						'https://api.adorable.io/avatars/23/abott@adorable.png'
					}
				/>
				<button onClick={() => auth.signOut()}>
					<img src='./logout.png' />
				</button>
			</div>
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
		forceBottomScrollElement?.current?.scrollIntoView({behavior: 'smooth'})
	}

	return (
		<>
			<div className='chat-room'>
				<main>
					{messages &&
						messages.map((msg, index) => (
							<ChatMessage key={index} message={msg} />
						))}

					<span ref={forceBottomScrollElement}></span>
				</main>
				<div className='form'>
					<form onSubmit={sendMessage}>
						<input
							value={formValue}
							onChange={(e) => setFormValue(e.target.value)}
							placeholder='Vamos conversar'
							type='text'
						/>

						<button type='submit' disabled={!formValue}>
							<img src='./sent.png' />
						</button>
					</form>
				</div>
			</div>
		</>
	)
}

function ChatMessage(props: any) {
	const {text, uid, photoURL, createdAt} = props.message

	const sentTime = new Date(createdAt?.seconds * 1000).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	})

	const messageClass = uid === auth?.currentUser?.uid ? 'sent' : 'received'

	return (
		<>
			<div className={`message ${messageClass}`}>
				<div className='bubble'>
					{messageClass === 'sent' ? (
						''
					) : (
						<img
							className='avatar'
							src={
								photoURL ||
								'https://api.adorable.io/avatars/23/abott@adorable.png'
							}
						/>
					)}
					<div className='display-message'>
						{messageClass === 'sent' ? (
							''
						) : (
							<strong>{auth?.currentUser?.displayName}</strong>
						)}
						<p>{text}</p>
						<small>{sentTime === 'Invalid Date' ? '' : sentTime}</small>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
