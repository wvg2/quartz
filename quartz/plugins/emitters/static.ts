import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import path, { dirname } from "path"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = joinSegments(outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }

    const robotsPath = path.resolve(QUARTZ, "..", "robots.txt")
    try {
      await fs.promises.access(robotsPath)
      const robotsOutputPath = joinSegments(argv.output, "robots.txt") as FilePath
      await fs.promises.copyFile(robotsPath, robotsOutputPath)
      yield robotsOutputPath
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
    }

    const headersPath = path.resolve(QUARTZ, "..", "_headers")
    try {
      await fs.promises.access(headersPath)
      const headersOutputPath = joinSegments(argv.output, "_headers") as FilePath
      await fs.promises.copyFile(headersPath, headersOutputPath)
      yield headersOutputPath
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
    }
  },
  async *partialEmit() {},
})
