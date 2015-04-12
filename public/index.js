var shaven = require('shaven'),
	index = require('./index'),
	gridVisibility = false,
	iconsHtml

iconsHtml = index
	.getIcons()
	.map(function (icon) {
		return '<div class=icon id=' + icon.basename + '>' +
		       icon.content +
		       '</div>'
	})
	.join('')


document
	.getElementById('icons')
	.innerHTML = iconsHtml

document
	.querySelector('#toggleGrid')
	.addEventListener('click', function (event) {
		toggleGrid()
	})


var gui = require('nw.gui'),
	win = gui.Window.get(),
	mb = new gui.Menu({type: "menubar"})

gui.Window.get().menu = mb

win.menu = new gui.Menu({type: 'menubar'})

win.on('close', function (event) {

	if (event === 'quit') {
		// TODO: save files, …
		win.close(true)
	}
	else
		win.hide()
})

gui.App.on('reopen', function () {
	win.show()
})


/*
 socket.on('icon', function (data) {
 var iconContainer = document.querySelector('#' + data.fileName)

 iconContainer.innerHTML = data.content
 })
 */
