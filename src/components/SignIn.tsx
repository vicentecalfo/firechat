import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

function SignIn({auth}: any) {
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

export default SignIn
