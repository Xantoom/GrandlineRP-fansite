import { useState } from 'react';

const localStorageKey = 'theme';
const defaultTheme = 'system';

type Theme = 'light' | 'dark' | 'system';

/**
 * Get the theme from local storage
 *
 * @returns {Theme}
 */
const getThemeFromLocalStorage = (): Theme => {
	const theme = localStorage.getItem(localStorageKey) as Theme | null;
	if (theme) return theme;
	setThemeToLocalStorage(defaultTheme);
	return defaultTheme;
};

/**
 * Set the theme to local storage
 *
 * @param {Theme} theme
 */
const setThemeToLocalStorage = (theme: Theme) => {
	localStorage.setItem(localStorageKey, theme);
};

/**
 * Hook to manage the theme
 *
 * @returns {Theme, (theme: Theme) => void}
 */
export const useTheme = (): {
	theme: Theme;
	toggleTheme: (theme: Theme) => void;
} => {
	const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage);

	const toggleTheme = (theme: Theme) => {
		setThemeToLocalStorage(theme);
		setTheme(theme);
	};

	return {
		theme,
		toggleTheme,
	};
};
