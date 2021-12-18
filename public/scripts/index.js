import toggleGrid from "./toggleGrid.js"

const socket = io()  // eslint-disable-line no-undef
const iconsContainer = window.document.querySelector("#icons")


document
  .querySelector("#toggleGrid")
  .addEventListener("click", () => toggleGrid())

socket.on("icon", (data) => {
  let iconContainer = window.document.querySelector("#" + data.basename)

  if (!iconContainer) {
    iconContainer = window.document.createElement("div")
    iconContainer.id = data.basename
    iconContainer.classList.add("icon")
    iconsContainer.appendChild(iconContainer)
  }

  iconContainer.innerHTML = data.content
})
