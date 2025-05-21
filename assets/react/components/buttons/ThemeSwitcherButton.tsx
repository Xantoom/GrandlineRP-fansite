import { useTheme } from '@/react/hooks/useTheme';
import React from 'react';

// Sun icon for light theme
const lightIconSvg = (
	<svg className="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
	</svg>
);

// Moon icon for dark theme
const darkIconSvg = (
	<svg className="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
	</svg>
);

// System icon for system theme
const systemIconSvg = (
	<svg className="swap-on h-10 w-10 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<g>
				<path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm0 1v8a4 4 0 0 1 0-8zM8.5 0h-1v2h1zm4.803 1.99L11.89 3.404l.707.707 1.414-1.414zm-10.606 0l-.707.707L3.404 4.11l.707-.707zM16 7.5h-2v1h2zm-14 0H0v1h2zm10.596 4.389l-.707.707 1.414 1.414.707-.707zm-9.192 0L1.99 13.303l.707.707 1.414-1.414zm5.096 2.11h-1v2h1z"></path>
			</g>
		</g>
	</svg>
);

export const ThemeSwitcherButton = () => {
	const { theme, toggleTheme } = useTheme();

	const handleThemeToggle = () => {
		if (theme === 'light') {
			toggleTheme('dark');
		} else if (theme === 'dark') {
			toggleTheme('system');
		} else {
			toggleTheme('light');
		}
	};

	return (
		<button onClick={handleThemeToggle} className="btn btn-ghost btn-circle" aria-label="Change thème">
			{theme === 'light' && lightIconSvg}
			{theme === 'dark' && darkIconSvg}
			{theme === 'system' && systemIconSvg}
		</button>
	);
};
