import js from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ ignores: ['**/!(assets)/**', 'node_modules', 'vendor', 'public', 'var'] },
	{ plugins: { '@stylistic/ts': stylisticTs } },
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2024,
			},
		},
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: {
			prettier: prettierPlugin,
			react: pluginReact,
			'react-hooks': reactHooks,
		},
		settings: {
			react: { version: 'detect' },
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'prettier/prettier': ['error', {}],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			...prettierConfig.rules,
		},
	},
]);
