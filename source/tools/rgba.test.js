import rgba from "./rgba.js"
import {test, expect} from "@jest/globals"

test("positive", () => {
  expect(rgba(25, 35, 16, 33))
    .toBe("rgba(25,35,16,33)")
})
