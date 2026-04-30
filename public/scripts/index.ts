import toggleGrid from "./toggleGrid.js"

declare const io: () => {
  on: (event: string, callback: (data: { basename: string; content: string }) => void) => void
}

const socket = io()
const iconsContainer = window.document.querySelector("#icons")!


document
  .querySelector("#toggleGrid")!
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
