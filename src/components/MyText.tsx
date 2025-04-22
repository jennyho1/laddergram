import { Devvit } from "@devvit/public-api";
import Glyphs from "../data/glyphs.json"  with { type: "json" };

type SupportedGlyphs = keyof typeof Glyphs;

type Glyph = {
  path: string;
  width: number;
  height: number;
};

// The 'children' type is gross. The text gets wrapped in an array, but string[] throws an error in vscode :()
interface MyTextProps {
  children: string | string[];
  size?: number;
  topMargin?: Devvit.Blocks.SizeString;
  bottomMargin?: Devvit.Blocks.SizeString;
  mode?: string; //dark, light, med
  width?: number;
}

export function MyText(props: MyTextProps): JSX.Element {
  const {
    children,
    size = 0.4,
    topMargin = "0px",
    bottomMargin = "0px",
    mode = "dark",
    width = 718,
  } = props;
  const words = children[0].split(" ");
  const baseHeight = Glyphs["f"].height;
  const gap = 1;
  const space = 9;
  const lineGap = 6;
	const maxWidth = width / size;
  const fillColor =
    mode == "dark" ? "#4e1e15" : mode == "light" ? "#ffe2bf" : "#c7ac8b";
  const strokeColor = mode == "dark" ? "#e2a868" : "#4e1e15";
  const characters: string[] = [];

	let lineWidth = 0;
  let currLineHeight = 0;
  let prevLineHeights = 0;
  let finalHeight = 0;
  let finalWidth = 0;
	let xOffset = 0;
  let yOffset = 0;

  words.forEach((word) => {
    // calculate width of word first to determine if it should be on new line
    let wordWidth = 0;
    for (const char of word) {
      const glyph: Glyph = Glyphs[char as SupportedGlyphs];
      if (!glyph) continue;
      wordWidth += glyph.width + gap;
    }
    if (lineWidth + wordWidth - gap > maxWidth) {
      // create new line
      prevLineHeights += currLineHeight + lineGap;
      currLineHeight = 0;
      lineWidth = 0;
			xOffset = 0;
    }

    // create the characters of the word
    const chars = word.split("");
    chars.forEach((char) => {
      const glyph: Glyph = Glyphs[char as SupportedGlyphs];
      if (!glyph) return;

      yOffset = baseHeight - glyph.height;
      if (char == "g") yOffset = 10;
      else if (char == "j") yOffset = 1;
      else if (char == "p") yOffset = 11;
      else if (char == "q") yOffset = 11;
      else if (char == "y") yOffset = 11;
      else if (char == "Q") yOffset = 2;
      else if (char == "-") yOffset = baseHeight / 2;
      else if (char == "+") yOffset = 8;

      if (glyph.height + yOffset > currLineHeight) {
        currLineHeight = glyph.height + yOffset;
      }
      // add to the yOffset the new line if there is any
      yOffset += prevLineHeights;

      characters.push(`<path
				d="${glyph.path}"
				transform="translate(${xOffset} ${yOffset})"
				stroke-linecap="round" 
				fill-rule="evenodd" 
				stroke="${strokeColor}" 
				stroke-width="0.2mm" 
				fill="${fillColor}"
			/>`);

      xOffset += glyph.width + gap;
      lineWidth = xOffset;
    });
    // Remove the trailing gap
    lineWidth -= gap;

    // update final width
    if (lineWidth > finalWidth) finalWidth = lineWidth;

    // add offset for 'space'
    if (lineWidth + space > maxWidth) {
      // add just enough to fill the maxWidth
      lineWidth = maxWidth;
      // since maxWidth is reached, create new line
      prevLineHeights += currLineHeight + lineGap;
      currLineHeight = 0;
      lineWidth = 0;
			xOffset = 0;
    } else {
      xOffset += space;
    }
  });

  // -----------------------------------------------------------------------------------------

  // if the last line is empty, remove extra line gap
  if (lineWidth == 0) {
    finalHeight = prevLineHeights - lineGap;
  } else {
		// else add the height of the last line
		finalHeight = prevLineHeights + currLineHeight;
	}

  const scaledHeight: Devvit.Blocks.SizeString = `${finalHeight * size}px`;
  const scaledWidth: Devvit.Blocks.SizeString = `${finalWidth * size}px`;

  return (
    <vstack>
      <spacer height={topMargin} />
      <image
        imageHeight={finalHeight}
        imageWidth={finalWidth}
        height={scaledHeight}
        width={scaledWidth}
        description={children[0]}
        resizeMode="fill"
        url={`data:image/svg+xml;charset=UTF-8,
        <svg
            width="${finalWidth}"
            height="${finalHeight}"
            viewBox="0 0 ${finalWidth} ${finalHeight}"
            fill="${fillColor}"
            xmlns="http://www.w3.org/2000/svg"
        >
        ${characters.join("")}
        </svg>
      `}
      />
      <spacer height={bottomMargin} />
    </vstack>
  );
}
