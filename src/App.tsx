import React from 'react'
import './App.scss'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

const firebaseConfig = {}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
	return (
		<div className='App'>
			<header className='App-header'></header>
		</div>
	)
}

export default App
