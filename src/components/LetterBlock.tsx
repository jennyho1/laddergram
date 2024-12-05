import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface LetterBlockProps {
  label: string;
  correct?: boolean;
  highlight?: boolean;
}

export const LetterBlock = (props: LetterBlockProps): JSX.Element => {
  const { label, correct = false, highlight = false } = props;
  const blockSize = 36;

  return (
    <zstack width={`${blockSize}px`} height={`${blockSize}px`} alignment="center middle">
      <image
        url={
          correct
            ? "letterBlock_correct.png"
            : highlight
            ? "letterBlock_highlight.png"
            : "woodButton_square.png"
        }
        description="logo"
        imageHeight={500}
        imageWidth={500}
        width={`${blockSize}px`}
        height={`${blockSize}px`}
        resizeMode="fill"
      />
      <MyText size={0.7}>
        {label}
      </MyText>
    </zstack>
  );
};
