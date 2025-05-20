import { useState } from 'react';

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

const setThemeToHTML = (theme: Theme) => {
	const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

	document.documentElement.setAttribute('data-theme', isDark ? 'dark-theme' : 'light-theme');
};

export const useTheme = (): {
	theme: Theme;
	toggleTheme: (theme: Theme) => void;
} => {
	const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage);

	const toggleTheme = (theme: Theme) => {
		setThemeToLocalStorage(theme);
		setThemeToHTML(theme);
		setTheme(theme);
	};

	return {
		theme,
		toggleTheme,
	};
};
