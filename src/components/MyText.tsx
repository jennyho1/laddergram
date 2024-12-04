import { Devvit } from "@devvit/public-api";
import Glyphs from "../data/glyphs.json";

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
  fillColor?: string;
  strokeColor?: string;
  topMargin?: Devvit.Blocks.SizeString;
  bottomMargin?: Devvit.Blocks.SizeString;
}

export function MyText(props: MyTextProps): JSX.Element {
  const {
    children,
    size = 1,
    fillColor = "#ffe2bf",
    strokeColor = "#4e1e15",
    topMargin = "0px",
    bottomMargin = "0px",
  } = props;
  const line = children[0].split("");
  const baseHeight = Glyphs["f"].height;
  const gap = 1;
  let maxHeight = 0;
  let width = 0;
  let xOffset = 0;
  let yOffset = 0;

  const characters: string[] = [];

  line.forEach((character) => {
    if (character === " ") {
      xOffset += 9 + gap;
      return;
    }

    const glyph: Glyph = Glyphs[character as SupportedGlyphs];
    if (!glyph) {
      return;
    }
    yOffset = baseHeight - glyph.height;
    if (character == "g") yOffset = 10;
    else if (character == "j") yOffset = 1;
    else if (character == "p") yOffset = 11;
    else if (character == "q") yOffset = 11;
    else if (character == "y") yOffset = 11;
    else if (character == "Q") yOffset = 2;
		else if (character == "-") yOffset = baseHeight/2;
		else if (character == "+") yOffset = 8;

    if (glyph.height + yOffset > maxHeight) {
      maxHeight = glyph.height + yOffset;
    }

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
    width = xOffset;
  });

  // Remove the trailing gap
  width -= gap;

  const scaledHeight: Devvit.Blocks.SizeString = `${maxHeight * size}px`;
  const scaledWidth: Devvit.Blocks.SizeString = `${width * size}px`;

  return (
    <vstack>
			<spacer height={topMargin}/>
      <image
        imageHeight={maxHeight}
        imageWidth={width}
        height={scaledHeight}
        width={scaledWidth}
        description={children[0]}
        resizeMode="fill"
        url={`data:image/svg+xml;charset=UTF-8,
        <svg
            width="${width}"
            height="${maxHeight}"
            viewBox="0 0 ${width} ${maxHeight}"
            fill="${fillColor}"
            xmlns="http://www.w3.org/2000/svg"
        >
        ${characters.join("")}
        </svg>
      `}
      />
			<spacer height={bottomMargin}/>
    </vstack>
  );
}
