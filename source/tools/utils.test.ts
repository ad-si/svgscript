import {clampTop, clampBottom, channelNormalize} from "./utils.js"
import {test, expect} from "@jest/globals"

test("clampTop", () => {
  expect(clampTop(50, 377))
    .toBe(50)
})

test("clampBottom", () => {
  expect(clampBottom(0, -37))
    .toBe(0)
})

test("channelNormalize", () => {
  expect(channelNormalize(300))
    .toBe(255)
})
