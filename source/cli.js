#! /usr/bin/env node

import fs from "fs/promises"
import path from "path"
import chalk from "chalk"
import chokidar from "chokidar"
import yaml from "js-yaml"
import jsBeautify from "js-beautify"

const beautifyHtml = jsBeautify.html

import * as svgScript from "./index.js"
import svgScriptServer from "./server.js"
import formatSvg from "./tools/formatSvg.js"
import make from "./make.js"


function getOptions (args) {
  const options = {
    args: [],
    flags: {},
  }

  args.forEach(cliArg => {
    if (/^--/.test(cliArg)) {
      const stripped = cliArg.slice(2)

      if (/^[a-z]+=.+/i.test(stripped)) {
        const split = stripped.split("=")
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
    a "target.yaml" file, or a directory.

    Commands:
      compile           -  Compile a SvgScript file and print to stdout
      compile-in-place  -  Compile file(s) / directory in place
      make              -  Build SVGs specified in target YAML file
      watch             -  Watch a file / directory and compile in place
      serve             -  Start server which hosts SVGs in the browser

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
  const absoluteIconPaths = args
    .slice(1)
    .map(arg => path.resolve(process.cwd(), arg))


  async function saveIcon (icon) {
    await fs.writeFile(icon.absoluteFilePath, icon.svg)

    console.info(
      chalk.green("Created",
        path.relative(process.cwd(), icon.absoluteFilePath),
      ),
    )
  }


  function compileIcon (icon) {
    if (!icon.content) return

    icon.svg = flags.beautify
      ? formatSvg(icon.content)
      : beautifyHtml(formatSvg(icon.content))

    if (!/\n$/.test(icon.svg)) icon.svg += "\n"

    return icon
  }


  async function compileAndWriteIcon (iconPaths, iconOptions) {
    const graphics = await svgScript
      .getIcons(iconPaths, iconOptions)

    if (graphics.length === 1) {
      saveIcon(compileIcon(graphics[0].value))
    }
    else {
      throw new Error(
        `${graphics.length} instead of just 1 graphic were passed`,
      )
    }
  }


  async function compileAndWriteIcons (iconPaths, iconOptions) {
    const icons = await svgScript
      .getIcons(iconPaths, iconOptions)

    await Promise.allSettled(
      icons
        .filter(settledProm => settledProm.status === "fulfilled")
        .map(icon => icon.value)
        .map(compileIcon)
        .map(saveIcon),
    )
  }


  if (args[0] === "compile") {
    let iconOptions = {}

    try {
      if (flags.options) {
        iconOptions = yaml.load(flags.options)
      }
    }
    catch (error) {
      console.error("Error in: " + flags.options)
      throw error
    }

    const icons = await svgScript.getIcons(absoluteIconPaths, iconOptions)

    console.info(icons[0].value.content)
  }
  else if (args[0] === "compile-in-place") {
    let iconOptions = {}

    if (flags.options) {
      iconOptions = yaml.load(flags.options)
    }

    await compileAndWriteIcons(absoluteIconPaths, iconOptions)
  }
  else if (args[0] === "watch") {
    let iconOptions = {}

    if (flags.options) {
      iconOptions = yaml.load(flags.options)
    }

    await compileAndWriteIcons(absoluteIconPaths, iconOptions)

    chokidar
      .watch(absoluteIconPaths, {
        ignored: /([/\\]\.|\.svg$)/,
        persistent: true,
      })
      .on("change", async iconPath => {
        console.info(`Change detected in ${iconPath}`)
        await compileAndWriteIcon(iconPath, iconOptions)
      })
      .on("error", error => {
        throw error
      })
  }
  else if (args[0] === "make") {
    make(absoluteIconPaths)
  }
  else if (args[0] === "serve") {
    svgScriptServer(absoluteIconPaths)
  }
  else {
    console.error(usageString)
    process.exit(1)
  }
}

main(process.argv.slice(2))
