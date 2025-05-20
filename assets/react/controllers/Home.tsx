import { useTheme } from '@/react/hooks/useTheme';
import React from 'react';

export default function (props: { fullName: string }) {
	// Theme can be 'light', 'dark', or 'system'
	const { theme, toggleTheme } = useTheme();

	return (
		<>
			<h1>Welcome to the Home Page {props.fullName}</h1>
			<div className={'mt-3 flex space-x-3'}>
				<button className="btn btn-primary">One</button>
				<button className="btn btn-secondary">Two</button>
				<button className="btn btn-accent btn-outline">Three</button>
			</div>

			<div className="mt-3">
				<button
					className="btn btn-primary"
					onClick={() => {
						// cycle through the themes
						if (theme === 'light') {
							toggleTheme('dark');
						} else if (theme === 'dark') {
							toggleTheme('system');
						} else {
							toggleTheme('light');
						}
					}}
				>
					{theme === 'light' ?
						'Switch to Dark Mode'
					: theme === 'dark' ?
						'Switch to System Mode'
					:	'Switch to Light Mode'}
				</button>
			</div>
		</>
	);
}
