var shaven = require('shaven'),
    yaml = require('js-yaml'),
    clone = require('clone')


module.exports = function (grunt) {

	var icons = []

	function formatSvg (svgString) {

		var missingNamespaces = []

		if (svgString.indexOf('/2000/svg') === -1)
			missingNamespaces
				.push('xmlns="http://www.w3.org/2000/svg"')

		if (svgString.indexOf('/1999/xlink') === -1)
			missingNamespaces
				.push('xmlns:xlink="http://www.w3.org/1999/xlink"')

		if (missingNamespaces !== [])
			svgString = svgString.replace(
				'<svg', '<svg ' + missingNamespaces.join(' ')
			)

		return svgString
	}

	grunt.config.init({
		svg2png: {
			all: {
				files: [
					{
						cwd: 'build/svg/',
						src: ['**/*.svg'],
						dest: 'build/png',
						ext: 'png'
					}
				]
			}
		}
	})

	grunt.loadNpmTasks('grunt-svg2png')


	grunt.registerTask('default', ['svg', 'png'])

	grunt.registerTask(
		'svg',
		'Writes SVG files to build directory',
		function () {

			var deployment = yaml.safeLoad(grunt.file.read('./icons/deployment.yaml'))


			if (deployment)
				deployment.icons.forEach(function (icon) {

					var iconModule = require(__dirname + '/icons/' + icon.fileName),
					    returnValue = iconModule()

					icon.targets.forEach(function (targetData, index) {

						var fileName,
						    scale = targetData.scale ?
						            '@' + targetData.scale :
						            '',
						    svgString

						fileName = icon.fileName
							.replace(/\.js$/i, scale + '.svg')


						grunt.log.write('Write icon', fileName, '… ')

						if (typeof returnValue !== 'string')
							returnValue = shaven(clone(iconModule(targetData)))[0]


						grunt.file.write(
							('./build/svg/' + fileName),
							formatSvg(returnValue)
						)

						grunt.log.ok()
					})
				})

			else {
				grunt.file.recurse(
					'./icons',
					function (abspath, rootdir, subdir, filename) {

						icons.push({
							name: filename,
							content: shaven(require('./' + abspath))[0]
						})
					}
				)

				icons.forEach(function (icon) {

					var iconName = icon.name.replace(/\.js$/i, '.svg')

					grunt.log.write('Write icon', iconName, '… ')
					grunt.file.write(
						('./build/svg/' + iconName),
						formatSvg(icon.content)
					)

					grunt.log.ok()
				})
			}
		}
	)

	grunt.registerTask(
		'png',
		'Converts SVG files to PNG and writes them to build directory',
		['svg2png']
	)
}
