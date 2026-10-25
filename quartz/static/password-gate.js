function enforcePasswordGate() {
  const CORRECT_PASSWORD = "ROUGE" // CHANGE THIS TO YOUR DESIRED PASSWORD
  const STORAGE_KEY = "site_access_granted"
  const CLOSED_AT_KEY = "site_access_closed_at"
  const REAUTHENTICATION_DELAY = 10 * 60 * 1000

  let accessGranted = false
  try {
    accessGranted = window.localStorage.getItem(STORAGE_KEY) === "true"
    const closedAt = Number(window.localStorage.getItem(CLOSED_AT_KEY))

    if (
      accessGranted &&
      (!Number.isFinite(closedAt) ||
        closedAt <= 0 ||
        Date.now() - closedAt >= REAUTHENTICATION_DELAY)
    ) {
      accessGranted = false
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(CLOSED_AT_KEY)
    } else if (accessGranted) {
      window.localStorage.removeItem(CLOSED_AT_KEY)
    }
  } catch (error) {
    console.error("Could not read the saved access permission.", error)
  }

  if (accessGranted) {
    window.addEventListener(
      "pagehide",
      () => {
        try {
          if (window.localStorage.getItem(STORAGE_KEY) === "true") {
            window.localStorage.setItem(CLOSED_AT_KEY, String(Date.now()))
          }
        } catch (error) {
          console.error("Could not save the access session end time.", error)
        }
      },
      { once: true },
    )
    return
  }

  const userPassword = window.prompt(
    "Access to this site is restricted. Please enter the password:",
  )

  if (userPassword === CORRECT_PASSWORD) {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true")
      window.localStorage.setItem(CLOSED_AT_KEY, String(Date.now()))
      window.location.reload()
    } catch (error) {
      console.error("Could not save the access permission.", error)
    }
    return
  }

  window.alert("Incorrect password! Access denied.")
  const message = document.createElement("h1")
  message.textContent = "⚠️ ACCESS DENIED. Please enter the correct password."
  message.style.cssText = "color:white;text-align:center;margin-top:20%;font-family:sans-serif;"
  document.body.replaceChildren(message)
  document.body.style.backgroundColor = "black"
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enforcePasswordGate, { once: true })
} else {
  enforcePasswordGate()
}
