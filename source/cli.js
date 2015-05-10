#! /usr/bin/env node

var fsp = require('fs-promise'),
	path = require('path'),
	chalk = require('chalk'),

	svgScript = require('./svgScript'),
	svgKit = require('./svgKit'),

	commandName = path.basename(process.argv[1]),
	args = process.argv.slice(2),
	beautifyHtml = require('js-beautify').html,
	flags = {}


args.forEach(function (cliArgument) {
	if (/^\-\-/i.test(cliArgument)) {
		return flags[cliArgument.slice(2)] = true
	}
})


if (args[0] === 'compile') {

	svgScript
		.getIcons(path.resolve(process.cwd(), args.pop()))
		.forEach(function (icon) {

			var content = svgKit.formatSvg(icon.content)

			if (flags.beautify)
				content = beautifyHtml(content)

			if (!/\n$/.test(content))
				content += '\n'

			fsp
				.writeFile(icon.filePath,content)
				.then(function () {
					console.log(chalk.green('Created', icon.fileName))
				})
				.catch(function (error) {
					console.error(chalk.red(error))
				})
		})
}
else {

	console.error('Usage: ' + commandName + ' compile <path-to-file/dir>')

	process.exit(1)
}
