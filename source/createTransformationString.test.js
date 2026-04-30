/* eslint-disable id-length */

import createTransformationString from "./createTransformationString.js"
import {test, expect} from "@jest/globals"

test("translate fills missing x with 0", () => {
  expect(createTransformationString([
    {transform: [{type: "translate", y: 5}]},
  ]))
    .toEqual([{transform: "translate(0,5)"}])
})

test("translate fills missing y with 0", () => {
  expect(createTransformationString([
    {transform: [{type: "translate", x: 5}]},
  ]))
    .toEqual([{transform: "translate(5,0)"}])
})

test("translate keeps both values when provided", () => {
  expect(createTransformationString([
    {transform: [{type: "translate", x: 3, y: 5}]},
  ]))
    .toEqual([{transform: "translate(3,5)"}])
})

test("translate defaults to 0,0 when neither x nor y is set", () => {
  expect(createTransformationString([
    {transform: [{type: "translate"}]},
  ]))
    .toEqual([{transform: "translate(0,0)"}])
})

test("rotate defaults degrees to 0", () => {
  expect(createTransformationString([
    {transform: [{type: "rotate"}]},
  ]))
    .toEqual([{transform: "rotate(0)"}])
})

test("multiple transformations are joined with a space", () => {
  expect(createTransformationString([
    {
      transform: [
        {type: "translate", x: 1, y: 2},
        {type: "rotate", degrees: 45},
      ],
    },
  ]))
    .toEqual([{transform: "translate(1,2) rotate(45)"}])
})
