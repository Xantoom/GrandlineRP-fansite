// Modified useTheme.tsx
import { useEffect, useState } from 'react';

const localStorageKey = 'theme';
const defaultTheme = 'system';

export type Theme = 'light' | 'dark' | 'system';

const getThemeFromLocalStorage = (): Theme => {
	const theme = localStorage.getItem(localStorageKey) as Theme | null;
	if (theme) return theme;
	setThemeToLocalStorage(defaultTheme);
	return defaultTheme;
};

const setThemeToLocalStorage = (theme: Theme) => {
	localStorage.setItem(localStorageKey, theme);
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
	const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

	document.documentElement.setAttribute('data-theme', isDark ? 'dark-theme' : 'light-theme');
};

export const useTheme = (): {
	theme: Theme;
	toggleTheme: (theme: Theme) => void;
} => {
	const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage);

	// Apply theme on first render and when theme changes
	useEffect(() => {
		// Setup system theme change listener
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};

		// Apply current theme
		applyTheme(theme);

		// Listen for system theme changes
		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme]);

	const toggleTheme = (theme: Theme) => {
		setThemeToLocalStorage(theme);
		setTheme(theme);
	};

	return {
		theme,
		toggleTheme,
	};
};
