import commonTags from "common-tags"
import createIcon from "./createIcon.js"
import basicIcon from "../fixtures/basic.svg.js"
import businessCard from "../fixtures/business-card.svg.js"
import {test, expect} from "@jest/globals"


const oneLine = commonTags.oneLine

test("create basic icon", () => {
  const expectedSvg = oneLine `
    <svg width="214mm" height="214mm" viewBox="0,0,214,214">
      <path
        d="
          M7,0
          h200
          a 7 7 0 0 0 7 7
          v200
          a 7 7 0 0 0 -7
          7h-56
          a 2 2 0 0 1 -2 -2
          v-8
          h-84
          v8
          a 2 2 0 0 1 -2 2
          h-56
          a 7 7 0 0 0 -7 -7
          v-200
          a 7 7 0 0 0 7 -7
          z
        "
        style="strokeWidth: 0.001mm; stroke: red"
      >
      </path>
    </svg>
  `
  const actualSvg = createIcon("test", basicIcon)

  expect(actualSvg.replaceAll(" ", ""))
    .toBe(expectedSvg.replaceAll(" ", ""))
})


test("create business card icon", () => {
  const expectedSvg = oneLine `
    <svg width="210mm" height="297mm" viewBox="0,0,210,297">
      <style>
        text {
          fill: rgb(60, 60, 60);
          font-family: Helvetica, sans-serif;
        }
      </style>
      <defs>
        <g id="card" style="text-anchor:middle;font-size:4px">
          <rect
            class="background"
            width="85"
            height="55"
            style="fill:rgb(255,255,255)"
          ></rect>
          <text
            class="name" x="42.5" y="18.7"
            style="font-size:6px;font-weight:900"
          >
            Thomas Smith
          </text>
          <text
            class="job" x="42.5" y="25.9"
            style="fill:rgb(100, 100, 100);font-size:4.8px"
          >
            CEO
          </text>
          <text
            class="email" x="42.5" y="36.3"
            style="fill:rgb(100, 100, 100)"
          >
            thomas@example.org
          </text>
        </g>
        <g class="grid" id="printSheet" transform="translate(20,11)">
          <g class="cells" transform="translate(0,0)">
            <g transform="translate(0,0)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(85,0)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(0,55)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(85,55)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(0,110)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(85,110)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(0,165)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(85,165)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(0,220)">
              <use class="card" xlink:href="#card"></use>
            </g>
            <g transform="translate(85,220)">
              <use class="card" xlink:href="#card"></use>
            </g>
          </g>
          <g
            class="cutMarks"
            style="stroke: rgb(127, 127, 127); stroke-width: 0.2"
          >
            <line x1="0" y1="0" x2="5" y2="0"></line>
            <line x1="85" y1="0" x2="80" y2="0"></line>
            <line x1="0" y1="-1" x2="0" y2="-6"></line>
            <line x1="85" y1="0" x2="90" y2="0"></line>
            <line x1="170" y1="0" x2="165" y2="0"></line>
            <line x1="85" y1="-1" x2="85" y2="-6"></line>
            <line x1="170" y1="-1" x2="170" y2="-6"></line>
            <line x1="0" y1="55" x2="5" y2="55"></line>
            <line x1="85" y1="55" x2="80" y2="55"></line>
            <line x1="85" y1="55" x2="90" y2="55"></line>
            <line x1="170" y1="55" x2="165" y2="55"></line>
            <line x1="0" y1="110" x2="5" y2="110"></line>
            <line x1="85" y1="110" x2="80" y2="110"></line>
            <line x1="85" y1="110" x2="90" y2="110"></line>
            <line x1="170" y1="110" x2="165" y2="110"></line>
            <line x1="0" y1="165" x2="5" y2="165"></line>
            <line x1="85" y1="165" x2="80" y2="165"></line>
            <line x1="85" y1="165" x2="90" y2="165"></line>
            <line x1="170" y1="165" x2="165" y2="165"></line>
            <line x1="0" y1="220" x2="5" y2="220"></line>
            <line x1="85" y1="220" x2="80" y2="220"></line>
            <line x1="0" y1="275" x2="5" y2="275"></line>
            <line x1="85" y1="275" x2="80" y2="275"></line>
            <line x1="0" y1="276" x2="0" y2="281"></line>
            <line x1="85" y1="220" x2="90" y2="220"></line>
            <line x1="170" y1="220" x2="165" y2="220"></line>
            <line x1="85" y1="275" x2="90" y2="275"></line>
            <line x1="170" y1="275" x2="165" y2="275"></line>
            <line x1="85" y1="276" x2="85" y2="281"></line>
            <line x1="170" y1="276" x2="170" y2="281"></line>
          </g>
        </g>
      </defs>
      <use xlink:href="#printSheet"></use>
    </svg>
  `

  expect(
    createIcon("businessCard", businessCard)
      .replace(/\s/g, ""),
  )
    .toBe(expectedSvg.replace(/\s/g, ""))
})
