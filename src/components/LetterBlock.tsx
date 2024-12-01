import { Devvit } from "@devvit/public-api";

interface LetterBlockProps {
  label: string;
	correct?: boolean;
	highlight?: boolean;
}

export const LetterBlock = (props: LetterBlockProps): JSX.Element => {
  const { label, correct, highlight } = props;
	const blockSize = "36px";

  return (
    <vstack
      width={blockSize}
      height={blockSize}
      alignment="center middle"
      backgroundColor={correct ? "#55a356" :"#c19b7a"}
      border="thick"
      borderColor={highlight ? "white" : "#3a322b"}
    >
      <text size="xxlarge" color="#3a322b" weight="bold">
        {label}
      </text>
    </vstack>
  );
};
