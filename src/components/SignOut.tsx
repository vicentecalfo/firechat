function SignOut({auth}: any) {
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

export default SignOut
