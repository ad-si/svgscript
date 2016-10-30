'use strict'

const fs = require('fs')
const path = require('path')
const shaven = require('shaven')
const semver = require('semver')
const traverse = require('traverse')
const rimraf = require('rimraf')
const yaml = require('js-yaml')
const chalk = require('chalk')

const tools = require('./tools')
const coordinateSystemAxes = require('./tools/coordinateSystemAxes')



function make (makeFilePath) {

	var iconsDirectory = path.dirname(makeFilePath),
		fileContent,
		deployment

	// Remove build folder
	rimraf.sync(path.join(path.dirname(makeFilePath), 'build'))

	try {
		fileContent = fs.readFileSync(makeFilePath)
		deployment = yaml.safeLoad(fileContent)
	}
	catch (error) {
		if (error.code !== 'ENOENT')
			throw error
	}

	console.log('Write Icons:')

	deployment.icons.forEach(function (icon) {

		var iconModule = require(iconsDirectory + '/' + icon.fileName)

		if (icon.skip)
			return

		icon.targets.forEach(function (targetData, index) {

			var fileName = icon.fileName,
				scale = ''


			if (targetData.fileName)
				fileName = targetData.fileName + '.js'
			else
				fileName = fileName.replace(
					/\.js$/i,
					(index === 0 ? '' : index) + '.js'
				)

			if (targetData.scale > 0) {
				scale = '@' + targetData.scale + 'x'
				fileName = fileName.replace(/\.js$/i, scale + '.js')
			}


			fileName = fileName.replace(/\.js$/i, '.svg')

			try {
				fs.mkdirSync(path.join(iconsDirectory, 'build'))
				fs.mkdirSync(path.join(iconsDirectory, 'build/svg'))
			}
			catch (error) {
				if (error.code !== 'EEXIST')
					throw error
			}

			process.stdout.write(' - ' + fileName)

			fs.writeFileSync(
				path.join(iconsDirectory, 'build/svg', fileName),
				svgKit.formatSvg(createIcon(
					icon.fileName,
					iconModule,
					targetData
				))
			)

			console.log(chalk.green(' ✔'))
		})
	})
}

function createTransformationString (content) {

	// Create transformation string from transformation objects

	return traverse(content).forEach(function (value) {

		if (typeof value === 'number')
			this.update(parseFloat(value.toFixed(15)))

		if (this.key === 'transform' && Array.isArray(value))
			this.update(
				value
					.map(transformation => {

						var string = transformation.type + '(',
							values = []

						if (transformation.type === 'rotate')
							values.push(transformation.degrees || 0)

						if (transformation.x)
							values.push(transformation.x)

						if (transformation.y)
							values.push(transformation.y)

						string += values.join()
						string += ')'

						return string
					})
					.join(' ')
			)
	})
}


function createIcon (name, module, targetData) {

	var content

	if (!module)
		throw new Error('Module ' + name + ' was not passed to createIcon().')

	if (!module.targetVersion || semver.lt(module.targetVersion, '0.4.0')) {

		if (module.shaven) {

			content = module.shaven(targetData, tools)

			if (!Array.isArray(content))
				throw new TypeError(name + '.shaven() must return an array!')

			content = createTransformationString(content)

			content.push(coordinateSystemAxes)

			content = shaven(content)[0]
		}
		else if (module.svg) {

			content = module.svg(targetData, tools)

			if (typeof content !== 'string')
				throw new TypeError(name + '.svg() must return a string!')
		}
		else if (typeof module === 'function') {

			content = module(targetData, tools)

			if (typeof content !== 'string')
				throw new TypeError(module + ' must return a string!')
		}
		else
			console.error(
				'Module ' + name + ' does not provide a suitable interface!'
			)
	}


	return content
}

function getIcons (absoluteIconsDirectoryPath) {

	let icons = []
	let fileNames

	absoluteIconsDirectoryPath = absoluteIconsDirectoryPath || path.resolve(
		__dirname,
		'../test/printerBed.js'
	)

	if (fs.statSync(absoluteIconsDirectoryPath).isFile()) {
		fileNames = [path.basename(absoluteIconsDirectoryPath)]
		absoluteIconsDirectoryPath = path.dirname(absoluteIconsDirectoryPath)
	}
	else {
		fileNames = fs.readdirSync(absoluteIconsDirectoryPath)
	}

	fileNames
		.filter(fileName => fileName.search(/.*\.(js|coffee)/) > -1)
		.forEach(iconPath => {

			iconPath = path.join(absoluteIconsDirectoryPath, iconPath)
			let name = path.basename(
				iconPath,
				path.extname(iconPath)
			)

			name += /.*\.svg$/.test(name) ? '' : '.svg'

			delete require.cache[require.resolve(iconPath)]

			try {
				const module = require(iconPath)

				icons.push({
					fileName: name,
					directoryName: absoluteIconsDirectoryPath,
					filePath: path.join(absoluteIconsDirectoryPath, name),
					content: createIcon(name, module)
				})
			}
			catch (error) {
				console.error(error.stack)
			}
		})

	return icons
}


module.exports = {
	getIcons: getIcons,
	createIcon: createIcon,
	make: make
}
