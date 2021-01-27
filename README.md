# SvgScript

Tooling and workflows for generating SVGs with JavaScript modules.
Includes a hostable GUI to edit the modules in real time.


## Installation

```sh
npm install --global svgscript
```


## Usage

```txt
Usage: svgscript [command] [path-to-file/dir]

[path-to-file/dir] is either a "*.svg.js" file,
a "targets.yaml" file, or a directory.

Commands:
  compile           -  Compile a SvgScript file and print to stdout
  compile-in-place  -  Compile file(s) / directory in place
  make              -  Build SVGs specified in targets YAML file
  watch             -  Watch a file / directory and compile in place
  serve             -  Start server which hosts SVGs in the browser

Options:
  --options=[YAML] - Icon options to customize SVG output
```

Try it out with following command which compiles all modules in place:

```sh
git clone https://github.com/ad-si/svgscript
svgscript compile-in-place svgscript/examples
```

Or following command which displays them with an interactive SVG viewer:

```sh
svgscript serve svgscript/examples
```


Or build SVGs as described in a targets YAML file:

```sh
svgscript make svgscript/examples/targets.yaml
```


## SvgScript Modules

SvgScript modules are simply ECMAScript modules
with specific methods and properties.
SvgScript modules must have following features:

- File ending: `<file-name>.svg.js`
- Should export following properties and methods:
  - `targetVersion`: Semver version-string of the target-version of SvgScript
  - `default function`: Returns a valid svg file as a string

- Optional methods:
  - `component()`: Exports the main group-component of the graphic
  - `defaults(defaultsObject)`:
      Get or set the default configuration values of the graphic
  - `config(configObject)`:
      Overwrite default configuration of graphic parameters
      or get current configuration


## Related

- [sketch-n-sketch] - Direct manipulation programming system for HTML and SVG.
- [svgsus] - SVG organizer and optimizer for macOS.
- [youidraw] - Vector graphic design webapp.

[sketch-n-sketch]: https://ravichugh.github.io/sketch-n-sketch
[svgsus]: http://www.svgs.us
[youidraw]: https://site.youidraw.com
