const path = require('path')
const ResolveTypeScriptPlugin = require('resolve-typescript-plugin')

module.exports = {
	stories: [
		"../packages/**/*.stories.ts",
		"../samples/**/*.stories.ts",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials"
	],
	framework: "@storybook/web-components",
	core: {
		builder: "@storybook/builder-webpack5"
	},
	webpackFinal: config => {
		config.mode = 'development'
		const [_babel, ...rest] = config.module.rules
		config.module.rules = [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						emitDeclarationOnly: false,
						noImplicitAny: false,
						noUnusedLocals: false,
						declaration: false,
						declarationMap: false,
						allowJs: false,
					}
				}
			},
			...rest
		]
		config.resolve.plugins = [...(config.resolve.plugins ?? []), new ResolveTypeScriptPlugin()]
		return config
	},
}