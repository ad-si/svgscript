# SvgScript

**Attention:** The following specifications are a work in progress for the first stable version of SvgScript.
The current implementation may differ greatly.

## Icons

Icons are simply node-modules with specific methods and properties.
Icons must have following features:

- File ending: `<file-name>.svg.js`
- Must export following properties and methods:
  - `targetVersion`: Semver version-string of the target-version of SvgScript
  - `svg()`: Returns a valid svg file as a string
  - `shaven()`: Returns a shaven array

- Optional methods:
  - `component()`: Exports the main group-component of the icon
  - `defaults(defaultsObject)`: Get or set the default configuration values of the icon
  - `config(configObject)`: Overwrite default configuration of icon parameters or get current configuration


## Names

- vectress - Together with vector she rules the stage
- svgear - Scalable Vector Gear
- vectorange - Orange vector
- vectorb
- vectorbital
- VectorBit


## Related

- [svgsus](http://www.svgs.us)
- [youidraw](http://site.youidraw.com)
