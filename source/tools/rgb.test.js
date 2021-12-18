import rgb from "./rgb.js"
import {test, expect} from "@jest/globals"

test("positive", () => {
  expect(rgb(25, 35, 16))
    .toBe("rgb(25,35,16)")
})

test("negative", () => {
  expect(rgb(-25, -35, -16))
    .toBe("rgb(0,0,0)")
})

test("overflow", () => {
  expect(rgb(325, 335, 316))
    .toBe("rgb(255,255,255)")
})

test("invalid values", () => {
  expect(() => rgb("25", "35", "16"))
    .toThrow(/Invalid value/)
})

test("too many values", () => {
  expect(() => rgb(25, 35, 16, 53))
    .toThrow(/Expected 3 arguments, not 4/)
})
