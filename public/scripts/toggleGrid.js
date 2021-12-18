import shaven from "shaven"
import grid from "../../source/tools/grid.js"

let gridVisibility = false


export default () => {
  const svgs = window.document.querySelectorAll("svg")

  if (gridVisibility) {
    Array
      .from(window.document.querySelectorAll("svg use.grid"))
      .forEach(container => container.remove())

    gridVisibility = false
  }
  else {
    const defsSvg = window.document.getElementById("definitions")

    if (!defsSvg) {
      window.document.body.insertAdjacentHTML(
        "beforeend",
        shaven(
          ["svg#definitions",
            ["defs", grid],
          ],
        )
          .toString(),
      )
    }

    for (let index = 0; index < svgs.length; index++) {
      svgs[index].insertAdjacentHTML(
        "beforeend",
        shaven(
          ["use.grid", {
            "xlink:href": "#grid",
          }],
        )
          .toString(),
      )
    }

    gridVisibility = true
  }
}
