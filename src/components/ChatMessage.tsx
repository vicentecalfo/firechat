function ChatMessage(props: any) {
	const {text, uid, photoURL, createdAt, displayName} = props.message
	const auth = props.auth

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
						{messageClass === 'sent' ? '' : <strong>{displayName}</strong>}
						<p>{text}</p>
						<small>{sentTime === 'Invalid Date' ? '' : sentTime}</small>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChatMessage
