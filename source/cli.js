#! /usr/bin/env node

'use strict'

const fsp = require('fs-promise')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')

const svgScript = require('./index')
const svgScriptServer = require('./server')
const formatSvg = require('./tools/formatSvg')

const commandName = path.basename(process.argv[1])
const args = process.argv.slice(2)
const absoluteIconsPath = path.resolve(process.cwd(), args.pop())
const beautifyHtml = require('js-beautify').html
const flags = {}


function compileIcons (iconPaths) {

	svgScript
		.getIcons(iconPaths)
		.forEach(function (icon) {

			var content = formatSvg(icon.content)

			if (flags.beautify)
				content = beautifyHtml(content)

			if (!/\n$/.test(content))
				content += '\n'

			fsp
				.writeFile(icon.filePath, content)
				.then(function () {
					console.log(chalk.green('Created', icon.fileName))
				})
				.catch(function (error) {
					console.error(chalk.red(error))
				})
		})
}


args.forEach(function (cliArgument) {
	if (/^\-\-/i.test(cliArgument)) {
		return flags[cliArgument.slice(2)] = true
	}
})


if (args[0] === 'compile' || args[0] === 'watch') {

	compileIcons(absoluteIconsPath)

	if (args[0] === 'watch') {

		chokidar
			.watch(absoluteIconsPath, {
				ignored: /[\/\\]\./,
				persistent: true
			})
			.on('change', function (path) {
				compileIcons(path)
			})
			.on('error', function (error) {
				throw error
			})
	}
}
else if (args[0] === 'make') {
	svgScript.make(absoluteIconsPath)
}
else if (args[0] === 'serve') {
	svgScriptServer(absoluteIconsPath)
}
else {

	console.error('Usage: ' + commandName + ' compile <path-to-file/dir>')

	process.exit(1)
}
