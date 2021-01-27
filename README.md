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
    a "target.yaml" file or a directory.

    Commands:
      compile - Compile file(s) in place to SVG (file.svg.js => file.svg)
      make    - Build SVGs specified in target YAML file
      watch   - Watch target file and compile on change
      serve   - Start server which hosts SVGs in the browser

    Options:
      --options=[YAML] - Icon options to customize SVG output
```

Try it out with e.g.:

```sh
git clone https://github.com/ad-si/svgscript
svgscript serve svgscript/tests/fixtures
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
