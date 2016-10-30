const fs = require('fs')
const shaven = require('shaven')
const yaml = require('js-yaml')
const path = require('path')
const rimraf = require('rimraf')

const svgScript = require('./public/svgScript')


module.exports = function (grunt) {
  const iconsDirectory = grunt.option('path')

  if (!iconsDirectory) {
    throw new Error('You must speficy an icons directory')
  }

  function formatSvg (svgString) {
    const missingNamespaces = []

    if (svgString.indexOf('/2000/svg') === -1) {
      missingNamespaces
        .push('xmlns="http://www.w3.org/2000/svg"')
    }
    if (svgString.indexOf('/1999/xlink') === -1) {
      missingNamespaces
        .push('xmlns:xlink="http://www.w3.org/1999/xlink"')
    }
    if (missingNamespaces !== []) {
      svgString = svgString.replace(
        '<svg', '<svg ' + missingNamespaces.join(' ')
      )
    }

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
            ext: 'png',
          },
        ],
      },
    },
    nodewebkit: {
      options: {
        platforms: ['osx'],
        buildDir: './webkitbuilds',
      },
      src: ['./public/**/*'],
    },
  })

  grunt.loadNpmTasks('grunt-svg2png')
  grunt.loadNpmTasks('grunt-node-webkit-builder')


  grunt.registerTask('default', ['svg', 'png'])

  grunt.registerTask(
    'svg',
    'Writes SVG files to build directory',
    () => {
      let fileContent
      let deployment

      // Remove build folder
      rimraf.sync('./build')

      try {
        fileContent = fs.readFileSync(
          path.join(iconsDirectory, 'deployment.yaml')
        )
        deployment = yaml.safeLoad(fileContent)
      }
      catch (error) {
        if (error.code !== 'ENOENT') throw error
      }


      if (deployment) {
        deployment.icons.forEach(icon => {
          const iconModule = require(iconsDirectory + '/' + icon.fileName)
          let returnValue

          if (icon.skip) return

          icon.targets.forEach((targetData, index) => {
            let fileName
            let scale = ''

            if (targetData.scale > 0) {
              scale = '@' + targetData.scale + 'x'
              fileName = icon
                .fileName
                .replace(/\.js$/i, scale + '.svg')
            }
            else {
              fileName = icon
                .fileName
                .replace(/\.js$/i,
                (index === 0 ? '' : index) + '.svg')
            }


            grunt.log.write('Write icon', fileName)

            if (iconModule.shaven) {
              returnValue = shaven(
                iconModule.shaven(targetData)
              )[0]
            }

            // else if (typeof iconModule() !== 'string')
            //  returnValue = shaven(iconModule(targetData))[0]
            else {
              returnValue = iconModule(targetData)
            }

            grunt.file.write(
              './build/svg/' + fileName,
              formatSvg(returnValue)
            )

            grunt.log.ok()
          })
        })
      }
      else {
        svgScript
          .getIcons(path.join(__dirname, iconsDirectory))
          .forEach(icon => {
            grunt.log.write('Write icon', icon.basename + '.svg ')

            grunt.file.write(
              path.join('./build/svg', icon.basename + '.svg'),
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

  grunt.registerTask(
    'webkit',
    'Builds node-webkit app',
    ['node-webkit-builder']
  )
}
