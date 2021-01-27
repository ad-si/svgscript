#! /usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import yaml from 'js-yaml'
import jsBeautify from 'js-beautify'

const beautifyHtml = jsBeautify.htm

import * as svgScript from './index.js'
import svgScriptServer from './server.js'
import formatSvg from './tools/formatSvg.js'
import make from './make.js'


function getOptions (args) {
  const options = {
    args: [],
    flags: {},
  }

  args.forEach(cliArg => {
    if (/^--/.test(cliArg)) {
      const stripped = cliArg.slice(2)

      if (/^[a-z]+=.+/i.test(stripped)) {
        const split = stripped.split('=')
        options.flags[split[0]] = split[1]
      }
      else {
        options.flags[stripped] = true
      }
    }
    else {
      options.args.push(cliArg)
    }
  })

  return options
}


function getUsageString (commandName) {
  return `
    Usage: ${commandName} [command] [path-to-file/dir]

    [path-to-file/dir] is either a "*.svg.js" file,
    a "target.yaml" file or a directory.

    Commands:
      compile - Compile file(s) in place to SVG (file.svg.js => file.svg)
      make    - Build SVGs specified in target YAML file
      watch   - Watch target file and compile on change
      serve   - Start server which hosts SVGs in the browser

    Options:
      --options=[YAML] - Icon options to customize SVG output
  `
}


async function main (cliArgs) {
  const commandName = path.basename(process.argv[1])
  const usageString = getUsageString(commandName)

  if (cliArgs.length < 2) {
    console.error(usageString)
    process.exit(1)
  }

  const {flags, args} = getOptions(cliArgs)
  const absoluteIconsPath = path.resolve(process.cwd(), args.pop())


  async function saveIcon (icon) {
    await fs.writeFile(icon.absoluteFilePath, icon.svg)

    console.info(
      chalk.green('Created',
        path.relative(process.cwd(), icon.absoluteFilePath),
      ),
    )
  }


  function compileIcon (icon) {
    if (!icon.content) return

    icon.svg = flags.beautify
      ? formatSvg(icon.content)
      : beautifyHtml(formatSvg(icon.content))

    if (!/\n$/.test(icon.svg)) icon.svg += '\n'

    return icon
  }


  async function compileIcons (iconPaths, iconOptions) {
    const icons = await svgScript
      .getIcons(iconPaths, iconOptions)

    if (icons.length === 1) {
      console.info(icons[0].content)
    }
    else {
      await Promise.allSettled(
        icons
          .map(compileIcon)
          .map(saveIcon),
      )
    }
  }


  if (args[0] === 'compile' || args[0] === 'watch') {
    let iconOptions

    try {
      iconOptions = yaml.load(flags.options)
    }
    catch (error) {
      console.error('Error in: ' + flags.options)
      throw error
    }

    await compileIcons(absoluteIconsPath, iconOptions)

    if (args[0] === 'watch') {
      chokidar
        .watch(absoluteIconsPath, {
          ignored: /[/\\]\./,
          persistent: true,
        })
        .on('change', compileIcons)
        .on('error', error => {
          throw error
        })
    }
  }
  else if (args[0] === 'make') {
    make(absoluteIconsPath)
  }
  else if (args[0] === 'serve') {
    svgScriptServer(absoluteIconsPath)
  }
  else {
    console.error(usageString)
    process.exit(1)
  }
}


main(process.argv.slice(2))
