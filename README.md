# SvgScript

**Attention:** The following specifications are a work in progress for the first stable version of SvgScript.
The current implementation may differ greatly.

## Icons

Icons are simply node-modules with specific methods and properties.
Icons must have following features:

- File ending: `<file-name>.svg.js`
- Must export following properties and methods:
	- `version`: The semver version-string of the target-version of SvgScript
	- `svg()`: Returns a valid svg file as a string
	- `shaven()`: Returns a shaven array

- Optional methods:
	- `component()`: Exports the main group-component of the icon
	- `defaults(defaultsObject)`: Get or set the default values for the icon
	- `config()`
