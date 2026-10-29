const languageStorageKey = "anime-wiki-language"

function getSavedLanguage() {
  try {
    return window.localStorage.getItem(languageStorageKey)
  } catch (error) {
    console.warn("Could not read the saved language preference.", error)
    return null
  }
}

function saveLanguage(language) {
  try {
    window.localStorage.setItem(languageStorageKey, language)
  } catch (error) {
    console.warn("Could not save the language preference.", error)
  }
}

const script =
  document.currentScript ?? document.querySelector('script[src$="/static/lang-memory.js"]')
const siteRoot = script ? new URL("../", script.src) : new URL("/", window.location.href)
const rootPath = siteRoot.pathname
const currentPath = window.location.pathname.replace(/\/+$/, "")
const japaneseIndexPath = `${rootPath}ja`
const legacyJapaneseIndexPath = `${japaneseIndexPath}/index-ja`
const turkishIndexPath = `${rootPath}index`
const isJapaneseIndex = [
  japaneseIndexPath,
  `${japaneseIndexPath}/index`,
  legacyJapaneseIndexPath,
  `${legacyJapaneseIndexPath}.html`,
].includes(currentPath)
const isTurkishIndex =
  currentPath === turkishIndexPath || currentPath === `${turkishIndexPath}.html`
const isRootIndex =
  currentPath === rootPath.replace(/\/+$/, "") ||
  currentPath === `${rootPath}index.html` ||
  currentPath === `${rootPath}index`
const savedLanguage = getSavedLanguage()

if (isRootIndex && savedLanguage === "ja") {
  window.location.replace(new URL("ja/", siteRoot))
} else if (isJapaneseIndex) {
  saveLanguage("ja")
} else if (isTurkishIndex) {
  saveLanguage("tr")
}

document.addEventListener(
  "submit",
  (event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement)) return

    const submitter = event.submitter
    if (!(submitter instanceof HTMLButtonElement) || !submitter.hasAttribute("formaction")) return

    const target = new URL(submitter.getAttribute("formaction"), window.location.href)
    saveLanguage(
      target.pathname === `${japaneseIndexPath}/` ||
        target.pathname === japaneseIndexPath ||
        target.pathname === `${japaneseIndexPath}/index` ||
        target.pathname === `${japaneseIndexPath}/index.html` ||
        target.pathname === legacyJapaneseIndexPath ||
        target.pathname === `${legacyJapaneseIndexPath}.html`
        ? "ja"
        : "tr",
    )
  },
  true,
)

document.addEventListener(
  "click",
  (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const link = target.closest("a")
    if (!link || getSavedLanguage() !== "ja") return

    const destination = new URL(link.href, window.location.href)
    if (destination.origin !== window.location.origin) return

    const isHomeLink =
      destination.pathname === rootPath ||
      destination.pathname === `${rootPath}index` ||
      destination.pathname === `${rootPath}index.html`

    if (isHomeLink) {
      link.href = new URL("ja/", siteRoot).href
    }
  },
  true,
)
