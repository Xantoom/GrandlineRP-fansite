import React from 'react';

export default function (props: { fullName: string }) {
	return (
		<>
			<h1>Welcome to the Home Page {props.fullName}</h1>
			<div className={'mt-3 flex space-x-3'}>
				<button className="btn btn-primary">One</button>
				<button className="btn btn-secondary">Two</button>
				<button className="btn btn-accent btn-outline">Three</button>
			</div>
		</>
	);
}
