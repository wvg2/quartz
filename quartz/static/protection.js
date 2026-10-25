function isEditableTarget(target) {
  return (
    target instanceof Element &&
    (target.closest("input, textarea, select, [contenteditable='true']") !== null ||
      target.closest("[data-allow-copy]") !== null)
  )
}

document.addEventListener("contextmenu", (event) => {
  if (!isEditableTarget(event.target)) {
    event.preventDefault()
  }
})

document.addEventListener("selectstart", (event) => {
  if (!isEditableTarget(event.target)) {
    event.preventDefault()
  }
})

document.addEventListener("copy", (event) => {
  if (!isEditableTarget(event.target)) {
    event.preventDefault()
  }
})

document.addEventListener("cut", (event) => {
  if (!isEditableTarget(event.target)) {
    event.preventDefault()
  }
})

document.addEventListener("keydown", (event) => {
  if (isEditableTarget(event.target)) return

  const key = event.key.toLowerCase()
  if ((event.ctrlKey || event.metaKey) && ["a", "c", "x"].includes(key)) {
    event.preventDefault()
  }
})
