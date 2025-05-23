import { useEffect, useState } from 'react';

const localStorageKey = 'theme';
const defaultTheme = 'system';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Gets the theme from local storage. If not found, sets the default theme.
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
 * Sets the theme in local storage.
 *
 * @param {Theme} theme
 */
const setThemeToLocalStorage = (theme: Theme) => {
	localStorage.setItem(localStorageKey, theme);
};

/**
 * Sets the theme on the HTML document based on the provided theme.
 *
 * @param {Theme} theme
 */
const setThemeToHTML = (theme: Theme) => {
	const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

	document.documentElement.setAttribute('data-theme', isDark ? 'dark-theme' : 'light-theme');
};

export const useTheme = (): {
	theme: Theme;
	toggleTheme: (theme: Theme) => void;
} => {
	const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage);

	useEffect(() => {
		// Setup listener for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = () => {
			// Only update if the current theme is set to "system"
			if (theme === 'system') setThemeToHTML('system');
		};

		// Add event listener
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		// Initial call to ensure correct theme is set
		setThemeToHTML(theme);

		// Clean up listener on unmount
		return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
	}, [theme]);

	/**
	 * Toggles the theme between light, dark, and system.
	 *
	 * @param {Theme} theme
	 */
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
