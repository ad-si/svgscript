import path from "path"
import { readFile } from "fs/promises"
import {test, expect} from "@jest/globals"

import make from "./make.js"


test("make targets as described in YAML file", async () => {
  const examplesDir = path.resolve("examples")
  const targetsFile = path.join(examplesDir, "targets.yaml")

  await make([targetsFile])

  async function readSvg (fileName) {
    return readFile(
      path.join(examplesDir, fileName),
      { encoding: "utf-8" },
    )
  }

  expect(await readSvg("skeleton.svg"))
    .toContain("<svg")

  expect(await readSvg("laptop-stand.svg"))
    .toContain("fill:green")

  expect(await readSvg("laptop-stand1.svg"))
    .toContain("fill:red")

  expect(await readSvg("laptop-stand2.svg"))
    .toContain("fill:blue")
})
